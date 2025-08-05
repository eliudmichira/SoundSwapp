// Enhanced PWA Service for SoundSwapp - Mobile Playlist Converter
export interface PWAInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface PWAInstallPrompt {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface ConversionData {
  id: string;
  playlistName: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  trackCount?: number;
  completedTracks?: number;
}

export interface PWAStatus {
  isInstalled: boolean;
  isStandalone: boolean;
  canInstall: boolean;
  isOnline: boolean;
  hasNotificationPermission: boolean;
}

export class PWAService {
  private static instance: PWAService;
  private deferredPrompt: PWAInstallPrompt | null = null;
  private isInstalled = false;
  private isStandalone = false;
  private isOnline = navigator.onLine;
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;
  private notificationQueue: any[] = [];
  private retryAttempts = 0;
  private maxRetryAttempts = 3;
  
  // Mobile-specific properties
  private readonly INSTALL_PROMPT_DELAY = 3000; // 3 seconds
  private readonly NOTIFICATION_TIMEOUT = 5000; // 5 seconds
  private installPromptShown = false;
  private lastPromptTime = 0;
  private readonly MIN_PROMPT_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

  private constructor() {
    this.checkInstallationStatus();
    this.setupEventListeners();
    this.initializeMobileFeatures();
  }

  static getInstance(): PWAService {
    if (!PWAService.instance) {
      PWAService.instance = new PWAService();
    }
    return PWAService.instance;
  }

  // Enhanced service worker registration with retry logic
  async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker not supported');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none' // Always check for updates
      });

      this.serviceWorkerRegistration = registration;
      console.log('Service Worker registered successfully:', registration);

      // Enhanced update handling
      this.setupServiceWorkerUpdateHandling(registration);
      
      // Check for updates every 30 seconds when app is active
      this.setupPeriodicUpdateCheck(registration);

      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      
      // Retry registration with exponential backoff
      if (this.retryAttempts < this.maxRetryAttempts) {
        this.retryAttempts++;
        const delay = Math.pow(2, this.retryAttempts) * 1000;
        setTimeout(() => this.registerServiceWorker(), delay);
      }
      
      return null;
    }
  }

  // Enhanced installation status check
  checkInstallationStatus(): void {
    // Check if running in standalone mode (installed PWA)
    this.isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      window.matchMedia('(display-mode: minimal-ui)').matches ||
      (window.navigator as any).standalone === true;

    // Check if app is installed
    this.isInstalled = this.isStandalone || 
                      localStorage.getItem('pwa-installed') === 'true';

    // Check for iOS Safari specific installation
    this.checkIOSInstallation();
  }

  // Check iOS installation status
  private checkIOSInstallation(): void {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = (window.navigator as any).standalone;
    
    if (isIOS && isInStandaloneMode) {
      this.isInstalled = true;
      this.isStandalone = true;
      localStorage.setItem('pwa-installed', 'true');
    }
  }

  // Initialize mobile-specific features
  private initializeMobileFeatures(): void {
    // Prevent zoom on input focus (mobile)
    this.preventZoomOnInput();
    
    // Handle mobile viewport changes
    this.handleViewportChanges();
    
    // Setup mobile-friendly touch events
    this.setupTouchEvents();
    
    // Handle mobile keyboard
    this.handleMobileKeyboard();
  }

  // Enhanced event listeners setup
  private setupEventListeners(): void {
    // Install prompt handling with mobile optimization
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e as unknown as PWAInstallPrompt;
      
      // Delay showing install prompt for better UX
      setTimeout(() => {
        if (this.shouldShowInstallPrompt()) {
          this.showInstallPrompt();
        }
      }, this.INSTALL_PROMPT_DELAY);
    });

    // App installed event
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      localStorage.setItem('pwa-installed', 'true');
      localStorage.setItem('pwa-install-date', new Date().toISOString());
      this.hideInstallPrompt();
      this.showInstallationSuccess();
      this.trackInstallEvent();
    });

    // Online/offline status
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.showOnlineNotification();
      this.processQueuedNotifications();
      this.sendMessageToSW({ type: 'NETWORK_STATUS', online: true });
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.showOfflineNotification();
      this.sendMessageToSW({ type: 'NETWORK_STATUS', online: false });
    });

    // Service worker messages
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        this.handleServiceWorkerMessage(event);
      });
    }

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.serviceWorkerRegistration) {
        this.serviceWorkerRegistration.update();
      }
    });

    // Handle iOS Safari specific events
    this.setupIOSEventListeners();
  }

  // Setup iOS-specific event listeners
  private setupIOSEventListeners(): void {
    // Handle iOS Safari share button
    window.addEventListener('touchstart', (e) => {
      // Detect if user might be trying to share/install
      if (e.touches.length > 1) return;
      
      const target = e.target as HTMLElement;
      if (target.closest('[data-ios-install-hint]')) {
        this.showIOSInstallInstructions();
      }
    });
  }

  // Setup service worker update handling
  private setupServiceWorkerUpdateHandling(registration: ServiceWorkerRegistration): void {
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          this.showUpdateNotification();
        }
      });
    });
  }

  // Setup periodic update checking
  private setupPeriodicUpdateCheck(registration: ServiceWorkerRegistration): void {
    setInterval(() => {
      if (!document.hidden) {
        registration.update().catch(console.error);
      }
    }, 30000); // Check every 30 seconds
  }

  // Check if install prompt should be shown
  private shouldShowInstallPrompt(): boolean {
    if (this.isInstalled || this.installPromptShown) return false;
    
    const lastPromptTime = parseInt(localStorage.getItem('pwa-last-prompt') || '0');
    const now = Date.now();
    
    return (now - lastPromptTime) > this.MIN_PROMPT_INTERVAL;
  }

  // Enhanced install prompt with mobile optimization
  showInstallPrompt(): void {
    if (!this.deferredPrompt || this.installPromptShown) return;

    // Check if we're on iOS Safari (different install flow)
    const isIOSSafari = /iPad|iPhone|iPod/.test(navigator.userAgent) && 
                        !(window.navigator as any).standalone &&
                        !window.matchMedia('(display-mode: standalone)').matches;

    if (isIOSSafari) {
      this.showIOSInstallInstructions();
      return;
    }

    this.createMobileInstallPrompt();
    this.installPromptShown = true;
    localStorage.setItem('pwa-last-prompt', Date.now().toString());
  }

  // Create mobile-optimized install prompt
  private createMobileInstallPrompt(): void {
    const existingPrompt = document.getElementById('pwa-install-prompt');
    if (existingPrompt) existingPrompt.remove();

    const promptContainer = document.createElement('div');
    promptContainer.id = 'pwa-install-prompt';
    promptContainer.innerHTML = `
      <div class="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
        <div class="bg-white rounded-t-xl sm:rounded-xl w-full max-w-md transform transition-transform duration-300 ease-out">
          <div class="p-6">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M6 19c0 1.1.9 2 2 2s2-.9 2-2--.9-2-2-2-2 .9-2 2zm12-3c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Install SoundSwapp</h3>
                <p class="text-sm text-gray-600">Convert playlists offline</p>
              </div>
            </div>
            
            <div class="space-y-3 mb-6">
              <div class="flex items-center gap-3 text-sm text-gray-600">
                <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Works offline
              </div>
              <div class="flex items-center gap-3 text-sm text-gray-600">
                <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Faster loading
              </div>
              <div class="flex items-center gap-3 text-sm text-gray-600">
                <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Push notifications
              </div>
            </div>
            
            <div class="space-y-3">
              <button 
                id="install-app-btn" 
                class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Install App
              </button>
              <button 
                id="dismiss-install-btn" 
                class="w-full text-gray-500 py-2 text-sm hover:text-gray-700 transition-colors"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(promptContainer);

    // Add event listeners
    const installBtn = promptContainer.querySelector('#install-app-btn');
    const dismissBtn = promptContainer.querySelector('#dismiss-install-btn');

    installBtn?.addEventListener('click', () => {
      this.installApp();
      promptContainer.remove();
    });

    dismissBtn?.addEventListener('click', () => {
      promptContainer.remove();
      localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    });

    // Animate in
    requestAnimationFrame(() => {
      promptContainer.classList.add('animate-in');
    });
  }

  // Show iOS install instructions
  private showIOSInstallInstructions(): void {
    const instructionsContainer = document.createElement('div');
    instructionsContainer.id = 'ios-install-instructions';
    instructionsContainer.innerHTML = `
      <div class="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
        <div class="bg-white rounded-t-xl w-full max-w-md transform transition-transform duration-300 ease-out">
          <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Install SoundSwapp</h3>
            
            <div class="space-y-4 mb-6">
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span class="text-xs font-bold text-blue-600">1</span>
                </div>
                <div>
                  <p class="text-sm text-gray-800">Tap the Share button</p>
                  <div class="flex items-center gap-1 text-xs text-gray-600 mt-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                    </svg>
                    <span>in Safari toolbar</span>
                  </div>
                </div>
              </div>
              
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span class="text-xs font-bold text-blue-600">2</span>
                </div>
                <div>
                  <p class="text-sm text-gray-800">Select "Add to Home Screen"</p>
                  <div class="flex items-center gap-1 text-xs text-gray-600 mt-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    <span>from the menu</span>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              id="close-ios-instructions" 
              class="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(instructionsContainer);

    const closeBtn = instructionsContainer.querySelector('#close-ios-instructions');
    closeBtn?.addEventListener('click', () => {
      instructionsContainer.remove();
    });
  }

  // Enhanced install app method
  async installApp(): Promise<void> {
    if (!this.deferredPrompt) return;

    try {
      await this.deferredPrompt.prompt();
      const choiceResult = await this.deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        this.trackInstallEvent('accepted');
      } else {
        console.log('User dismissed the install prompt');
        this.trackInstallEvent('dismissed');
      }
      
      this.deferredPrompt = null;
      this.hideInstallPrompt();
    } catch (error) {
      console.error('Installation failed:', error);
      this.showInstallError();
    }
  }

  // Hide install prompt
  hideInstallPrompt(): void {
    const installPrompt = document.getElementById('pwa-install-prompt');
    if (installPrompt) {
      installPrompt.remove();
    }
  }

  // Enhanced update notification
  showUpdateNotification(): void {
    const updateNotification = this.createNotification('update', {
      title: 'Update Available',
      message: 'A new version is ready with improvements',
      actions: [
        {
          text: 'Update Now',
          action: () => window.location.reload(),
          primary: true
        },
        {
          text: 'Later',
          action: () => this.dismissNotification('update')
        }
      ],
      icon: `
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
      `,
      color: 'bg-blue-600'
    });
    
    document.body.appendChild(updateNotification);
  }

  // Enhanced installation success notification
  showInstallationSuccess(): void {
    const successNotification = this.createNotification('success', {
      title: 'App Installed!',
      message: 'SoundSwapp is now ready to use offline',
      autoRemove: 3000,
      icon: `
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      `,
      color: 'bg-green-600'
    });
    
    document.body.appendChild(successNotification);
  }

  // Enhanced offline notification
  showOfflineNotification(): void {
    const offlineNotification = this.createNotification('offline', {
      title: 'Working Offline',
      message: 'Some features may be limited',
      persistent: true,
      icon: `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      `,
      color: 'bg-yellow-600',
      position: 'bottom-left'
    });
    
    document.body.appendChild(offlineNotification);
  }

  // Show online notification
  private showOnlineNotification(): void {
    // Remove offline notification
    this.dismissNotification('offline');
    
    const onlineNotification = this.createNotification('online', {
      title: 'Back Online',
      message: 'All features are now available',
      autoRemove: 2000,
      icon: `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path>
        </svg>
      `,
      color: 'bg-green-600',
      position: 'bottom-left'
    });
    
    document.body.appendChild(onlineNotification);
  }

  // Generic notification creator
  private createNotification(id: string, options: {
    title: string;
    message: string;
    icon?: string;
    color?: string;
    position?: string;
    actions?: Array<{text: string; action: () => void; primary?: boolean}>;
    autoRemove?: number;
    persistent?: boolean;
  }): HTMLElement {
    const {
      title,
      message,
      icon = '',
      color = 'bg-gray-800',
      position = 'top-right',
      actions = [],
      autoRemove,
      persistent = false
    } = options;

    const positionClasses = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
    };

    const notification = document.createElement('div');
    notification.id = `pwa-notification-${id}`;
    notification.className = `fixed ${positionClasses[position as keyof typeof positionClasses]} z-50 max-w-sm transform transition-all duration-300 ease-out`;
    
    notification.innerHTML = `
      <div class="${color} text-white p-4 rounded-lg shadow-lg">
        <div class="flex items-start gap-3">
          ${icon ? `<div class="flex-shrink-0">${icon}</div>` : ''}
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-sm">${title}</p>
            <p class="text-sm opacity-90 mt-1">${message}</p>
            ${actions.length > 0 ? `
              <div class="flex gap-2 mt-3">
                ${actions.map(action => `
                  <button 
                    class="px-3 py-1 text-xs rounded ${action.primary ? 'bg-white text-gray-900' : 'bg-white/20'} font-medium hover:opacity-80 transition-opacity"
                    onclick="this.closest('[id^=pwa-notification]').dispatchEvent(new CustomEvent('action', {detail: '${action.text}'}))"
                  >
                    ${action.text}
                  </button>
                `).join('')}
              </div>
            ` : ''}
          </div>
          ${!persistent ? `
            <button 
              onclick="this.closest('[id^=pwa-notification]').remove()" 
              class="flex-shrink-0 text-white/60 hover:text-white transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          ` : ''}
        </div>
      </div>
    `;

    // Add action event listeners
    actions.forEach(action => {
      notification.addEventListener('action', (e: any) => {
        if (e.detail === action.text) {
          action.action();
        }
      });
    });

    // Auto-remove if specified
    if (autoRemove && !persistent) {
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, autoRemove);
    }

    return notification;
  }

  // Dismiss notification
  private dismissNotification(id: string): void {
    const notification = document.getElementById(`pwa-notification-${id}`);
    if (notification) {
      notification.remove();
    }
  }

  // Enhanced service worker message handling
  private handleServiceWorkerMessage(event: MessageEvent): void {
    const { type, data } = event.data;

    switch (type) {
      case 'CONVERSION_PROGRESS':
        this.showConversionProgress(data);
        break;
      case 'CONVERSION_COMPLETED':
        this.showConversionNotification(data);
        break;
      case 'CONVERSION_FAILED':
        this.showConversionError(data);
        break;
      case 'OFFLINE_MODE':
        this.showOfflineNotification();
        break;
      case 'CACHE_UPDATED':
        console.log('Cache updated:', data);
        break;
      case 'SYNC_COMPLETED':
        this.showSyncNotification(data);
        break;
    }
  }

  // Show conversion progress
  private showConversionProgress(data: ConversionData): void {
    const progressNotification = document.getElementById('conversion-progress');
    if (progressNotification) {
      // Update existing notification
      const progressBar = progressNotification.querySelector('.progress-bar') as HTMLElement;
      const progressText = progressNotification.querySelector('.progress-text') as HTMLElement;
      
      if (progressBar && data.progress !== undefined) {
        progressBar.style.width = `${data.progress}%`;
      }
      
      if (progressText && data.completedTracks && data.trackCount) {
        progressText.textContent = `${data.completedTracks}/${data.trackCount} tracks`;
      }
    } else {
      // Create new progress notification
      this.createProgressNotification(data);
    }
  }

  // Create progress notification
  private createProgressNotification(data: ConversionData): void {
    const progressNotification = this.createNotification('conversion-progress', {
      title: `Converting ${data.playlistName}`,
      message: data.completedTracks && data.trackCount ? 
        `${data.completedTracks}/${data.trackCount} tracks` : 'Processing...',
      persistent: true,
      icon: `
        <div class="w-6 h-6 animate-spin">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
        </div>
      `,
      color: 'bg-blue-600'
    });

    // Add progress bar
    const progressContainer = document.createElement('div');
    progressContainer.className = 'mt-2';
    progressContainer.innerHTML = `
      <div class="w-full bg-white/20 rounded-full h-2">
        <div class="progress-bar bg-white rounded-full h-2 transition-all duration-300" style="width: ${data.progress || 0}%"></div>
      </div>
      <div class="progress-text text-xs mt-1 opacity-75">
        ${data.completedTracks && data.trackCount ? `${data.completedTracks}/${data.trackCount} tracks` : 'Starting...'}
      </div>
    `;

    const messageDiv = progressNotification.querySelector('.text-sm.opacity-90');
    messageDiv?.parentNode?.insertBefore(progressContainer, messageDiv.nextSibling);
    
    progressNotification.id = 'conversion-progress';
    document.body.appendChild(progressNotification);
  }

  // Enhanced conversion notification
  showConversionNotification(data: ConversionData): void {
    // Remove progress notification
    this.dismissNotification('conversion-progress');

    // Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification('SoundSwapp', {
        body: `Conversion completed: ${data.playlistName}`,
        icon: '/images/app-icon-192.png',
        badge: '/images/app-icon-192.png',
        tag: 'conversion-completed',
        data: data
      });

      notification.addEventListener('click', () => {
        window.focus();
        window.location.href = `/conversions/${data.id}`;
      });
    }

    // Show in-app notification
    const completionNotification = this.createNotification('conversion-completed', {
      title: 'Conversion Complete!',
      message: `${data.playlistName} is ready`,
      actions: [
        {
          text: 'View Results',
          action: () => window.location.href = `/conversions/${data.id}`,
          primary: true
        },
        {
          text: 'Dismiss',
          action: () => this.dismissNotification('conversion-completed')
        }
      ],
      icon: `
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
        </svg>
      `,
      color: 'bg-green-600',
      autoRemove: 8000
    });
    
    document.body.appendChild(completionNotification);
  }

  // Show conversion error
  private showConversionError(data: ConversionData): void {
    // Remove progress notification
    this.dismissNotification('conversion-progress');

    const errorNotification = this.createNotification('conversion-error', {
      title: 'Conversion Failed',
      message: `Could not convert ${data.playlistName}`,
      actions: [
        {
          text: 'Retry',
          action: () => this.retryConversion(data),
          primary: true
        },
        {
          text: 'Dismiss',
          action: () => this.dismissNotification('conversion-error')
        }
      ],
      icon: `
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      `,
      color: 'bg-red-600'
    });
    
    document.body.appendChild(errorNotification);
  }

  // Show sync notification
  private showSyncNotification(data: any): void {
    const syncNotification = this.createNotification('sync-completed', {
      title: 'Data Synced',
      message: 'Your conversions are up to date',
      autoRemove: 3000,
      icon: `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
      `,
      color: 'bg-blue-600'
    });
    
    document.body.appendChild(syncNotification);
  }

  // Show install error
  private showInstallError(): void {
    const errorNotification = this.createNotification('install-error', {
      title: 'Installation Failed',
      message: 'Unable to install app. Please try again.',
      actions: [
        {
          text: 'Retry',
          action: () => this.installApp(),
          primary: true
        }
      ],
      icon: `
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      `,
      color: 'bg-red-600',
      autoRemove: 5000
    });
    
    document.body.appendChild(errorNotification);
  }

  // Enhanced notification permission request
  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      this.showNotificationPermissionDenied();
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        this.showNotificationPermissionGranted();
        return true;
      } else {
        this.showNotificationPermissionDenied();
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  // Show notification permission granted
  private showNotificationPermissionGranted(): void {
    const notification = this.createNotification('notification-granted', {
      title: 'Notifications Enabled',
      message: 'You\'ll be notified when conversions complete',
      autoRemove: 3000,
      icon: `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5-5-5h5V3h0z"></path>
        </svg>
      `,
      color: 'bg-green-600'
    });
    
    document.body.appendChild(notification);
  }

  // Show notification permission denied
  private showNotificationPermissionDenied(): void {
    const notification = this.createNotification('notification-denied', {
      title: 'Notifications Blocked',
      message: 'Enable in browser settings to get conversion updates',
      actions: [
        {
          text: 'Settings',
          action: () => this.openNotificationSettings()
        }
      ],
      icon: `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"></path>
        </svg>
      `,
      color: 'bg-yellow-600'
    });
    
    document.body.appendChild(notification);
  }

  // Open notification settings (browser-specific)
  private openNotificationSettings(): void {
    // This will vary by browser, but we can provide general guidance
    alert('To enable notifications:\n\n1. Click the lock/info icon in your address bar\n2. Set Notifications to "Allow"\n3. Refresh the page');
  }

  // Mobile-specific utility methods
  private preventZoomOnInput(): void {
    // Prevent zoom on input focus for iOS Safari
    const meta = document.querySelector('meta[name="viewport"]');
    if (meta) {
      const originalContent = meta.getAttribute('content') || '';
      
      document.addEventListener('focusin', (e) => {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
          meta.setAttribute('content', originalContent + ', user-scalable=no');
        }
      });
      
      document.addEventListener('focusout', () => {
        meta.setAttribute('content', originalContent);
      });
    }
  }

  // Handle viewport changes
  private handleViewportChanges(): void {
    let viewportHeight = window.innerHeight;
    
    window.addEventListener('resize', () => {
      const currentHeight = window.innerHeight;
      const heightDifference = viewportHeight - currentHeight;
      
      // Detect keyboard open/close on mobile
      if (Math.abs(heightDifference) > 150) {
        document.body.classList.toggle('keyboard-open', heightDifference > 0);
        
        // Adjust notifications position when keyboard is open
        const notifications = document.querySelectorAll('[id^="pwa-notification"]');
        notifications.forEach(notification => {
          if (heightDifference > 0) {
            (notification as HTMLElement).style.bottom = '20px';
          } else {
            (notification as HTMLElement).style.bottom = '';
          }
        });
      }
      
      viewportHeight = currentHeight;
    });
  }

  // Setup touch events for better mobile interaction
  private setupTouchEvents(): void {
    // Add touch feedback for buttons
    document.addEventListener('touchstart', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        target.classList.add('touch-feedback');
      }
    });
    
    document.addEventListener('touchend', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        setTimeout(() => {
          target.classList.remove('touch-feedback');
        }, 150);
      }
    });
  }

  // Handle mobile keyboard
  private handleMobileKeyboard(): void {
    // Scroll active input into view when keyboard opens
    document.addEventListener('focusin', (e) => {
      const target = e.target as HTMLElement;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    });
  }

  // Process queued notifications
  private processQueuedNotifications(): void {
    if (!this.isOnline || this.notificationQueue.length === 0) return;
    
    const queue = [...this.notificationQueue];
    this.notificationQueue = [];
    
    queue.forEach(notification => {
      this.showConversionNotification(notification);
    });
  }

  // Track install event (for analytics)
  private trackInstallEvent(outcome?: string): void {
    // Send analytics event
    if ('gtag' in window) {
      (window as any).gtag('event', 'pwa_install', {
        outcome: outcome || 'completed',
        timestamp: new Date().toISOString()
      });
    }
    
    // Store install info
    localStorage.setItem('pwa-install-outcome', outcome || 'completed');
  }

  // Retry conversion
  private retryConversion(data: ConversionData): void {
    this.dismissNotification('conversion-error');
    this.sendMessageToSW({
      type: 'RETRY_CONVERSION',
      conversionId: data.id
    });
  }

  // Enhanced message sending to service worker
  sendMessageToSW(message: any): void {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        ...message,
        timestamp: Date.now(),
        clientId: this.generateClientId()
      });
    } else if (this.serviceWorkerRegistration?.active) {
      this.serviceWorkerRegistration.active.postMessage({
        ...message,
        timestamp: Date.now(),
        clientId: this.generateClientId()
      });
    }
  }

  // Generate unique client ID
  private generateClientId(): string {
    return `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Enhanced queue conversion with retry logic
  queueConversion(conversion: any): void {
    const conversionWithRetry = {
      ...conversion,
      retryCount: 0,
      maxRetries: 3,
      queuedAt: Date.now()
    };
    
    this.sendMessageToSW({
      type: 'QUEUE_CONVERSION',
      conversion: conversionWithRetry
    });
    
    // Show queued notification
    this.showConversionQueued(conversion);
  }

  // Show conversion queued notification
  private showConversionQueued(conversion: any): void {
    const queuedNotification = this.createNotification('conversion-queued', {
      title: 'Conversion Queued',
      message: `${conversion.playlistName} will process when online`,
      icon: `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      `,
      color: 'bg-blue-600',
      autoRemove: 4000
    });
    
    document.body.appendChild(queuedNotification);
  }

  // Get comprehensive PWA status
  getPWAStatus(): PWAStatus {
    return {
      isInstalled: this.isInstalled,
      isStandalone: this.isStandalone,
      canInstall: this.deferredPrompt !== null,
      isOnline: this.isOnline,
      hasNotificationPermission: 'Notification' in window && Notification.permission === 'granted'
    };
  }

  // Enhanced app info
  getAppInfo(): {
    name: string;
    version: string;
    isPWA: boolean;
    isInstalled: boolean;
    isStandalone: boolean;
    installDate?: string;
    lastUpdate?: string;
    cacheSize?: number;
    features: string[];
  } {
    return {
      name: 'SoundSwapp',
      version: '2.0.0',
      isPWA: true,
      isInstalled: this.isInstalled,
      isStandalone: this.isStandalone,
      installDate: localStorage.getItem('pwa-install-date') || undefined,
      lastUpdate: localStorage.getItem('pwa-last-update') || undefined,
      features: [
        'Offline conversion',
        'Push notifications',
        'Background sync',
        'App shortcuts',
        'Share target'
      ]
    };
  }

  // Check for app updates
  async checkForUpdates(): Promise<boolean> {
    if (!this.serviceWorkerRegistration) return false;
    
    try {
      await this.serviceWorkerRegistration.update();
      return true;
    } catch (error) {
      console.error('Failed to check for updates:', error);
      return false;
    }
  }

  // Clear app cache
  async clearCache(): Promise<void> {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }
    
    // Clear local storage
    const keysToKeep = ['pwa-installed', 'pwa-install-date'];
    const keysToRemove = Object.keys(localStorage).filter(key => 
      key.startsWith('pwa-') && !keysToKeep.includes(key)
    );
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  // Get cache usage
  async getCacheUsage(): Promise<number> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        return estimate.usage || 0;
      } catch (error) {
        console.error('Failed to get cache usage:', error);
      }
    }
    return 0;
  }
}

// Export singleton instance
export const pwaService = PWAService.getInstance();

// Enhanced utility functions
export const isPWAInstalled = (): boolean => {
  return pwaService.getPWAStatus().isInstalled;
};

export const isStandalone = (): boolean => {
  return pwaService.getPWAStatus().isStandalone;
};

export const canInstallPWA = (): boolean => {
  return pwaService.getPWAStatus().canInstall;
};

export const installPWA = (): Promise<void> => {
  return pwaService.installApp();
};

export const requestNotifications = (): Promise<boolean> => {
  return pwaService.requestNotificationPermission();
};

export const getPWAStatus = (): PWAStatus => {
  return pwaService.getPWAStatus();
};

// Initialize PWA service when module loads
if (typeof window !== 'undefined') {
  // Auto-register service worker
  pwaService.registerServiceWorker();
  
  // Request notification permission after user interaction
  let userInteracted = false;
  const requestNotificationOnInteraction = () => {
    if (!userInteracted) {
      userInteracted = true;
      setTimeout(() => {
        pwaService.requestNotificationPermission();
      }, 2000);
      
      // Remove listeners after first interaction
      document.removeEventListener('click', requestNotificationOnInteraction);
      document.removeEventListener('touchstart', requestNotificationOnInteraction);
    }
  };
  
  document.addEventListener('click', requestNotificationOnInteraction);
  document.addEventListener('touchstart', requestNotificationOnInteraction);
}

// Add CSS for mobile enhancements
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    .touch-feedback {
      opacity: 0.7;
      transform: scale(0.98);
      transition: all 0.1s ease;
    }
    
    body.keyboard-open {
      height: 100vh;
      overflow: hidden;
    }
    
    @media (max-width: 768px) {
      [id^="pwa-notification"] {
        max-width: calc(100vw - 2rem);
        margin: 0 1rem;
      }
    }
    
    .animate-in {
      animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(1rem);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
}
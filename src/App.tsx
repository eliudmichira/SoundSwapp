// The new JSX transform in React 17+ doesn't require this import for just JSX
// import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Removed useNavigate
import { ThemeProvider } from './lib/ThemeContext';
import { AuthProvider } from './lib/AuthContext'; // Removed useAuth, as RedirectHandler is removed
import { ConversionProvider } from './lib/ConversionContext';
import { UserProvider } from './context/UserContext';
import ModernPlaylistConverter from './components/EnhancedPlaylistConverter';
import { MobileConverter } from './components/MobileConverter';
import SpotifyCallback from './components/SpotifyCallback';
import YouTubeCallback from './components/YouTubeCallback';
import Login from './components/Login';
import MobileLogin from './components/MobileLogin';
import { PrivateRoute } from './components/PrivateRoute';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import PreloaderDemo from './components/PreloaderDemo';
import AppInitializer from './components/AppInitializer';
import TokenManagerInitializer from './components/TokenManagerInitializer';
import { useState, useEffect, createContext, useContext } from 'react';
// Import our new useMobileDetection hook
import useMobileDetection from './hooks/useMobileDetection';
import { ParticleField } from './components/ui/ParticleField';
import { ShareModal } from './components/ui/ShareModal';
import { useShareModal } from './hooks/useShareModal';
import { ConversionInsights } from './components/ConversionInsights';
import { MobileContext } from './context/MobileContext';
import { MobileFailedTracksDetails } from './components/visualization/MobileFailedTracksDetails';
import networkResilience from './services/networkResilience';
// Removed Firebase auth and getAuthRedirectResult imports, as RedirectHandler is removed

// Declare global window interface for mobile debugging
declare global {
  interface Window {
    _mobileDebug?: {
      isMobile: boolean;
      isPortrait: boolean;
      isIOS: boolean;
      isAndroid: boolean;
      userAgent: string;
      viewport: {
        width: number;
        height: number;
        devicePixelRatio: number;
      };
      date: string;
    };
  }
}

// CSS for the --angle property and animations
const angularCss = `
  :root {
    --angle: 0deg;
  }
  
  @property --angle {
    syntax: '<angle>';
    initial-value: 0deg;
    inherits: false;
  }
  
  @keyframes rotate {
    to {
      --angle: 360deg;
    }
  }
`;

// Removed RedirectHandler component

function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileDetectionReady, setMobileDetectionReady] = useState(false);
  
  // Use our enhanced mobile detection hook
  const { isMobile, isPortrait, isIOS, isAndroid } = useMobileDetection();
  
  // Force mobile layout for testing (check URL parameter or localStorage)
  const forceMobile = new URLSearchParams(window.location.search).get('mobile') === 'true' || 
                     localStorage.getItem('forceMobile') === 'true';
  
  const { isOpen, shareData, closeShareModal } = useShareModal();
  
  // Add debugging for mobile issues
  useEffect(() => {
    console.log('App.tsx: Mobile detection state:', { isMobile, isPortrait, isIOS, isAndroid });
    
    // Initialize network resilience service
    networkResilience.initialize();
    
    // Mark mobile detection as ready after first detection
    setMobileDetectionReady(true);
    
    // Add global function for testing mobile layout
    (window as any).toggleMobileLayout = () => {
      const current = localStorage.getItem('forceMobile') === 'true';
      localStorage.setItem('forceMobile', (!current).toString());
      window.location.reload();
    };
    
    if (isMobile) {
      console.log('Mobile device detected', { isPortrait, isIOS, isAndroid });
      
      // Add mobile debugging info to window object for troubleshooting
      window._mobileDebug = {
        isMobile,
        isPortrait,
        isIOS,
        isAndroid,
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
          devicePixelRatio: window.devicePixelRatio
        },
        date: new Date().toISOString()
      };
    }
  }, [isMobile, isPortrait, isIOS, isAndroid]);
  
  // Update mobile status when the component mounts or orientation changes  
  useEffect(() => {
    if (isMobile) {
      // When the app first loads, indicate that animations should be deferred
      document.body.classList.add('defer-animations');
      
      // Once page loads, enable animations
      const timeout = setTimeout(() => {
        document.body.classList.remove('defer-animations');
        document.body.classList.add('animations-ready');
      }, 1000); // 1 second delay
      
      // Set body classes based on orientation
      if (isPortrait) {
        document.body.classList.add('portrait');
        document.body.classList.remove('landscape');
      } else {
        document.body.classList.add('landscape');
        document.body.classList.remove('portrait');
      }
      
      // Add OS-specific classes
      if (isIOS) document.body.classList.add('ios-device');
      if (isAndroid) document.body.classList.add('android-device');
      
      return () => clearTimeout(timeout);
    }
  }, [isMobile, isPortrait, isIOS, isAndroid]);
  
  // Mobile context value 
  const mobileContextValue = {
    isPortrait,
    isMobile
  };

  // Debug which layout is being rendered
  const shouldRenderMobile = isMobile || forceMobile;
  console.log('App.tsx: Rendering layout:', { 
    isMobile, 
    forceMobile, 
    shouldRenderMobile,
    isPortrait, 
    layout: shouldRenderMobile ? 'MOBILE' : 'DESKTOP' 
  });

  // Show loading screen while mobile detection is initializing
  if (!mobileDetectionReady) {
    console.log('App.tsx: Mobile detection not ready yet, showing loading...');
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Detecting device...</p>
        </div>
      </div>
    );
  }

  // Render mobile layout if mobile is detected
  if (shouldRenderMobile) {
    console.log('App.tsx: Rendering MOBILE layout');
    return (
      <ThemeProvider>
        <AuthProvider>
          <UserProvider>
            <ConversionProvider>
              <TokenManagerInitializer>
                <MobileContext.Provider value={mobileContextValue}>
                  <ParticleField
                    colorScheme="colorful"
                    density="medium"
                    interactive={true}
                    className="fixed top-0 left-0 w-full h-full z-[-1]"
                  />
                  <Router>
                    <style>{angularCss}</style>
                    <AppInitializer>
                      <Routes>
                        <Route path="/" element={<PrivateRoute element={<MobileConverter />} />} />
                        <Route path="/login" element={<MobileLogin />} />
                        <Route path="/callback" element={<SpotifyCallback />} />
                        <Route path="/youtube-callback" element={<YouTubeCallback />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/terms-of-service" element={<TermsOfService />} />
                        <Route path="/preloader-demo" element={<PreloaderDemo />} />
                        <Route path="/insights/:id" element={<PrivateRoute element={<ConversionInsights />} />} />
                        <Route path="/failed-tracks" element={<PrivateRoute element={<MobileFailedTracksDetails />} />} />
                        <Route path="*" element={<Navigate to="/" />} />
                      </Routes>
                      <ShareModal
                        isOpen={isOpen}
                        onClose={closeShareModal}
                        title={shareData.title}
                        url={shareData.url}
                        description={shareData.description}
                      />
                    </AppInitializer>
                  </Router>
                </MobileContext.Provider>
              </TokenManagerInitializer>
            </ConversionProvider>
          </UserProvider>
        </AuthProvider>
      </ThemeProvider>
    );
  }

  // Render desktop layout for desktop screens
  console.log('App.tsx: Rendering DESKTOP layout');
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserProvider>
          <ConversionProvider>
            <TokenManagerInitializer>
              <MobileContext.Provider value={mobileContextValue}>
                <ParticleField
                  colorScheme="colorful"
                  density="medium"
                  interactive={true}
                  className="fixed top-0 left-0 w-full h-full z-[-1]"
                />
                <Router>
                  <style>{angularCss}</style>
                  <AppInitializer>
                    <Routes>
                      <Route path="/" element={<PrivateRoute element={<ModernPlaylistConverter />} />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/callback" element={<SpotifyCallback />} />
                      <Route path="/youtube-callback" element={<YouTubeCallback />} />
                      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                      <Route path="/terms-of-service" element={<TermsOfService />} />
                      <Route path="/preloader-demo" element={<PreloaderDemo />} />
                      <Route path="/insights/:id" element={<PrivateRoute element={<ConversionInsights />} />} />
                      <Route path="/failed-tracks/:id" element={<PrivateRoute element={<MobileFailedTracksDetails />} />} />
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                    <ShareModal
                      isOpen={isOpen}
                      onClose={closeShareModal}
                      title={shareData.title}
                      url={shareData.url}
                      description={shareData.description}
                    />
                  </AppInitializer>
                </Router>
              </MobileContext.Provider>
            </TokenManagerInitializer>
          </ConversionProvider>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
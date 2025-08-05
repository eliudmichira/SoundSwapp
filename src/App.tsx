// The new JSX transform in React 17+ doesn't require this import for just JSX
// import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Removed useNavigate
import { ThemeProvider } from './lib/ThemeContext';
import { AuthProvider } from './lib/AuthContext'; // Removed useAuth, as RedirectHandler is removed
import { ConversionProvider } from './lib/ConversionContext';
import { UserProvider } from './context/UserContext';
import ModernPlaylistConverter from './components/EnhancedPlaylistConverter';
import SpotifyCallback from './components/SpotifyCallback';
import YouTubeCallback from './components/YouTubeCallback';
import Login from './components/Login';
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

// Create orientation context for mobile devices
interface MobileContext {
  isPortrait: boolean;
  isMobile: boolean;
}

export const MobileContext = createContext<MobileContext>({
  isPortrait: true,
  isMobile: false
});

export const useMobile = () => useContext(MobileContext);

// Removed RedirectHandler component

function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use our enhanced mobile detection hook
  const { isMobile, isPortrait, isIOS, isAndroid } = useMobileDetection();
  
  const { isOpen, shareData, closeShareModal } = useShareModal();
  
  // Add debugging for mobile issues
  useEffect(() => {
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
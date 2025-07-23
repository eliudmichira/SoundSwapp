import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faMusic } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { useTheme } from '../lib/ThemeContext';
import SoundSwappLogo from '../assets/SoundSwappLogo';

export default function TermsOfService() {
  const { isDark } = useTheme();
  
  return (
    <div className={isDark ? "bg-gray-900 text-white min-h-screen" : "bg-white text-gray-800 min-h-screen"}>
      <header className={`p-4 border-b ${isDark ? "border-gray-800" : "border-gray-200"}`}>
        <div className="container mx-auto flex items-center">
          <Link to="/" className={`flex items-center text-sm font-medium ${isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to App
          </Link>
          <h1 className="text-xl font-bold mx-auto">Terms of Service</h1>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4 max-w-4xl">
        <div className={`prose ${isDark ? "prose-invert" : ""} max-w-none`}>
          <h2>Terms of Service</h2>
          <p><strong>Last updated: {new Date().toLocaleDateString()}</strong></p>
          
          <h3>Use of Service</h3>
          <p>By using Playlist Converter, you agree to use the app for personal, non-commercial purposes only. You are responsible for complying with the terms of Spotify and YouTube.</p>
          
          <h3>Third-Party APIs</h3>
          <p>This app uses the Spotify and YouTube APIs. You are responsible for following their terms of use. We are not affiliated with or endorsed by Spotify or YouTube.</p>
          
          <h3>No Warranty</h3>
          <p>Playlist Converter is provided "as is" without warranty of any kind. We do not guarantee the accuracy, reliability, or availability of the service.</p>
          
          <h3>Contact</h3>
          <p>For questions or concerns, contact us at <a href="mailto:michmichira@gmail.com">michmichira@gmail.com</a>.</p>
        </div>
      </main>
      
      <footer className={`py-10 border-t ${isDark ? "bg-gray-900 border-gray-800" : "bg-gray-50 border-gray-200"}`}>
        <div className="container mx-auto px-4">
          {/* Footer top section with logo and social links */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                <SoundSwappLogo width={40} height={40} />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-400">
                Playlist Converter
              </span>
            </div>
            
            <div className="flex space-x-5">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                  isDark 
                    ? "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white" 
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-900"
                }`}
              >
                <FontAwesomeIcon icon={faGithub} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                  isDark 
                    ? "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white" 
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-900"
                }`}
              >
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a 
                href={`mailto:michmichira@gmail.com`}
                className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                  isDark 
                    ? "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white" 
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-900"
                }`}
              >
                <FontAwesomeIcon icon={faMusic} />
              </a>
            </div>
          </div>
          
          {/* Divider */}
          <div className={`h-px w-full my-6 ${isDark ? "bg-gray-800" : "bg-gray-200"}`} />
          
          {/* Footer links section */}
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 mb-4 md:mb-0">
              <Link 
                to="/privacy-policy" 
                className={`text-sm transition-colors duration-200 ${
                  isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms-of-service" 
                className={`text-sm transition-colors duration-200 ${
                  isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Terms of Service
              </Link>
              <Link 
                to="/" 
                className={`text-sm transition-colors duration-200 ${
                  isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Home
              </Link>
            </div>
            
            <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-600"}`}>
              © {new Date().getFullYear()} Playlist Converter. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 
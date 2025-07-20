# 🎵 SoundSwapp

**Modern music playlist converter with seamless Spotify ↔ YouTube synchronization**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-SoundSwapp-blue?style=for-the-badge&logo=firebase)](https://soundswapp.web.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/eliudmichira/SoundSwapp)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Hosting-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)

---

## 🚀 Overview

SoundSwapp is a modern web application that enables users to seamlessly convert and sync music playlists between Spotify and YouTube Music. Built with cutting-edge technologies, it provides a beautiful, intuitive interface for music lovers to bridge the gap between different streaming platforms.

### 🌟 **Key Features**
- **Cross-Platform Playlist Conversion**: Convert playlists between Spotify and YouTube Music
- **Real-Time Authentication**: Secure OAuth integration with both platforms
- **Smart Track Matching**: Intelligent algorithm to match songs across platforms
- **Modern UI/UX**: Glassmorphic design with responsive layout
- **Profile Integration**: Display real user profiles from both services
- **Offline Support**: Progressive Web App capabilities

---

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - Modern UI framework with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions

### **Backend & Services**
- **Firebase Authentication** - Secure user authentication
- **Firebase Firestore** - Real-time database
- **Firebase Hosting** - Global CDN deployment
- **Spotify Web API** - Music data and playlist management
- **YouTube Data API v3** - YouTube Music integration

### **Development Tools**
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **GitHub Actions** - CI/CD pipeline (planned)

---

## ✨ Features

### 🎧 **Playlist Management**
- **Bidirectional Conversion**: Spotify ↔ YouTube Music
- **Smart Track Matching**: AI-powered song identification
- **Batch Processing**: Convert entire playlists at once
- **Progress Tracking**: Real-time conversion status

### 🔐 **Authentication & Security**
- **OAuth 2.0 Integration**: Secure authentication with both platforms
- **Token Management**: Automatic token refresh and storage
- **Fallback Authentication**: Robust error recovery system
- **Profile Synchronization**: Real user profile display

### 🎨 **User Experience**
- **Glassmorphic Design**: Modern, translucent UI elements
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Dark/Light Mode**: Theme switching capability
- **Real-Time Updates**: Live connection status and progress

### 📱 **Mobile Optimization**
- **Progressive Web App**: Install as native app
- **Touch-Friendly Interface**: Optimized for mobile devices
- **Offline Capabilities**: Basic functionality without internet
- **Performance Optimized**: Fast loading and smooth interactions

---

## 🚦 Getting Started

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Spotify Developer Account
- Google Cloud Console Account (for YouTube API)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/eliudmichira/SoundSwapp.git
   cd SoundSwapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Spotify API
   VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
   VITE_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   
   # YouTube API
   VITE_YOUTUBE_CLIENT_ID=your_youtube_client_id
   VITE_YOUTUBE_CLIENT_SECRET=your_youtube_client_secret
   
   # Firebase (optional for local development)
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### **Building for Production**
```bash
npm run build
npm run preview
```

---

## 🚀 Deployment

### **Firebase Hosting (Recommended)**
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init hosting

# Build and deploy
npm run build
firebase deploy --only hosting
```

### **Other Platforms**
- **Vercel**: Connect GitHub repository for automatic deployment
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use GitHub Actions for deployment

---

## 📱 Screenshots

### **Main Dashboard**
![Dashboard](https://placehold.co/800x500/1a1a1a/ffffff?text=SoundSwapp+Dashboard)

### **Authentication Flow**
![Authentication](https://placehold.co/800x500/1a1a1a/ffffff?text=Spotify+%26+YouTube+Auth)

### **Playlist Conversion**
![Conversion](https://placehold.co/800x500/1a1a1a/ffffff?text=Playlist+Conversion+Process)

---

## 🔧 Configuration

### **Spotify API Setup**
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new application
3. Add redirect URI: `https://soundswapp.web.app/spotify-callback`
4. Copy Client ID and Client Secret to environment variables

### **YouTube API Setup**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable YouTube Data API v3
3. Create OAuth 2.0 credentials
4. Add redirect URI: `https://soundswapp.web.app/youtube-callback`
5. Copy Client ID and Client Secret to environment variables

### **Firebase Setup**
1. Create a new Firebase project
2. Enable Authentication (Google provider)
3. Enable Firestore database
4. Configure security rules
5. Copy configuration to environment variables

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m 'feat: Add amazing feature'
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### **Development Guidelines**
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Spotify** for their comprehensive Web API
- **Google** for YouTube Data API
- **Firebase** for backend services
- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework

---

## 📞 Support

- **Live Demo**: [https://soundswapp.web.app](https://soundswapp.web.app)
- **GitHub Issues**: [Report a bug](https://github.com/eliudmichira/SoundSwapp/issues)
- **Email**: [eliudsamwels7@gmail.com](mailto:eliudsamwels7@gmail.com)
- **Website**: [eliudsamwel.dev](https://eliudsamwel.dev)

---

## 👤 Author

**Eliud Michira**

- **GitHub**: [@eliudmichira](https://github.com/eliudmichira)
- **Website**: [eliudsamwel.dev](https://eliudsamwel.dev)
- **Email**: [eliudsamwels7@gmail.com](mailto:eliudsamwels7@gmail.com)

---

<div align="center">

**Made with ❤️ by [Eliud Michira](https://github.com/eliudmichira)**

[![GitHub stars](https://img.shields.io/gith

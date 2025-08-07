/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Updated Image-Based Theme
        brand: {
          'primary-action': 'hsl(var(--brand-primary-action-hsl))', // Coral/Orange
          // 'secondary-action' can be kept if still used, or repurposed/removed.
          // For now, assume spotify/youtube act as main colored accents alongside primary.
        },
        background: {
          DEFAULT: 'hsl(var(--bg-primary-hsl))',
          primary: 'hsl(var(--bg-primary-hsl))',
          secondary: 'hsl(var(--bg-secondary-hsl))',
        },
        surface: {
          DEFAULT: 'hsl(var(--surface-card-hsl))',
          card: 'hsl(var(--surface-card-hsl))',
          alt: 'hsl(var(--surface-alt-hsl))',
          highlight: 'hsl(var(--surface-highlight-hsl))',
          tooltip: 'hsl(var(--surface-tooltip-hsl))',
          glass: 'hsla(var(--surface-glass-hsl), 0.65)',
        },
        content: {
          DEFAULT: 'hsl(var(--text-primary-hsl))',
          primary: 'hsl(var(--text-primary-hsl))',
          secondary: 'hsl(var(--text-secondary-hsl))',
          tertiary: 'hsl(var(--text-tertiary-hsl))',
          link: 'hsl(var(--text-link-hsl))', // Now defaults to spotify green
          'on-primary-action': 'hsl(var(--text-on-primary-action-hsl))',
          'on-spotify': 'hsl(var(--text-on-platform-spotify-hsl))',
          'on-youtube': 'hsl(var(--text-on-platform-youtube-hsl))',
          // Remove old 'on-highlight-yellow' etc. if not used by new theme
        },
        border: {
          DEFAULT: 'hsl(var(--border-default-hsl))',
          strong: 'hsl(var(--border-strong-hsl))',
          interactive: 'hsl(var(--border-interactive-hsl))', // Now defaults to spotify green
          focus: 'hsl(var(--border-focus-hsl))', // Coral/Orange
        },
        button: {
          primary: { // Coral/Orange button
            DEFAULT: 'hsl(var(--button-primary-bg-hsl))',
            bg: 'hsl(var(--button-primary-bg-hsl))',
            text: 'hsl(var(--button-primary-text-hsl))',
            hover: 'hsl(var(--button-primary-hover-bg-hsl))',
            glow: 'var(--button-primary-glow-hsl)',
          },
          spotify: { // Spotify Green button
            DEFAULT: 'hsl(var(--button-spotify-bg-hsl))',
            bg: 'hsl(var(--button-spotify-bg-hsl))',
            text: 'hsl(var(--button-spotify-text-hsl))',
            hover: 'hsl(var(--button-spotify-hover-bg-hsl))',
            glow: 'var(--button-spotify-glow-hsl)',
          },
          youtube: { // YouTube Red button
            DEFAULT: 'hsl(var(--button-youtube-bg-hsl))',
            bg: 'hsl(var(--button-youtube-bg-hsl))',
            text: 'hsl(var(--button-youtube-text-hsl))',
            hover: 'hsl(var(--button-youtube-hover-bg-hsl))',
            glow: 'var(--button-youtube-glow-hsl)',
          },
          secondary: { // Kept for other potential secondary actions, uses a darker teal now
            DEFAULT: 'hsl(var(--button-secondary-bg-hsl))',
            bg: 'hsl(var(--button-secondary-bg-hsl))',
            text: 'hsl(var(--button-secondary-text-hsl))', // Assuming this is defined, e.g., white
            hover: 'hsl(var(--button-secondary-hover-bg-hsl))',
            glow: 'var(--button-secondary-glow-hsl)',
          },
          // Remove old highlight-yellow/pink buttons if they are not part of the new theme
        },
        input: {
          DEFAULT: 'hsl(var(--input-bg-hsl))',
          bg: 'hsl(var(--input-bg-hsl))',
          text: 'hsl(var(--input-text-hsl))',
          border: 'hsl(var(--input-border-hsl))',
          'focus-ring': 'var(--input-focus-ring-hsl))', // Now spotify green
          placeholder: 'hsl(var(--input-placeholder-hsl))',
        },
        spotify: { // Platform specific colors
          DEFAULT: 'hsl(var(--spotify-base-color-hsl))',
          text: 'hsl(var(--text-on-platform-spotify-hsl))',
          glow: 'hsla(var(--spotify-base-color-hsl), 0.4)', // Glow remains hsla
        },
        youtube: { // Platform specific colors
          DEFAULT: 'hsl(var(--youtube-base-color-hsl))',
          text: 'hsl(var(--text-on-platform-youtube-hsl))',
          glow: 'hsla(var(--youtube-base-color-hsl), 0.4)', // Glow remains hsla
        },
        state: {
          error: 'hsl(var(--state-error-hsl))',
          warning: 'hsl(var(--state-warning-hsl))',
          success: 'hsl(var(--state-success-hsl))',
          info: 'hsl(var(--state-info-hsl))',
        },
        // Core Brand & Action Colors (already defined, ensure they are suitable or adjust)
        'brand-primary': 'hsl(var(--brand-primary-hsl) / <alpha-value>)', // Spotify Green
        'brand-primary-hover': 'hsl(var(--brand-primary-hover-hsl) / <alpha-value>)',
        'brand-primary-action': 'hsl(var(--brand-primary-action-hsl) / <alpha-value>)', // Coral/Orange
        'brand-primary-action-hover': 'hsl(var(--brand-primary-action-hover-hsl) / <alpha-value>)',
        'brand-secondary': 'hsl(var(--brand-secondary-hsl) / <alpha-value>)', // YouTube Red
        'brand-secondary-hover': 'hsl(var(--brand-secondary-hover-hsl) / <alpha-value>)',
        'brand-secondary-action': 'hsl(var(--brand-secondary-action-hsl) / <alpha-value>)', // Dark Teal
        'brand-secondary-action-hover': 'hsl(var(--brand-secondary-action-hover-hsl) / <alpha-value>)',
        
        // Accent & Highlight Colors
        'brand-accent-coral': 'hsl(var(--brand-accent-coral-hsl) / <alpha-value>)',
        'brand-accent-lime': 'hsl(var(--brand-accent-lime-hsl) / <alpha-value>)',
        'brand-accent-purple': 'hsl(var(--brand-accent-purple-hsl) / <alpha-value>)',
        'brand-accent-lavender': 'hsl(var(--brand-accent-lavender-hsl) / <alpha-value>)',
        'brand-highlight-pink': 'hsl(var(--brand-highlight-pink-hsl) / <alpha-value>)',
        'brand-highlight-yellow': 'hsl(var(--brand-highlight-yellow-hsl) / <alpha-value>)',

        // Stepper Specific Colors
        'stepper-active-ring': 'hsl(var(--stepper-active-ring-color-hsl) / <alpha-value>)',
        'stepper-active-icon-bg': 'hsl(var(--stepper-active-icon-bg-hsl) / <alpha-value>)',
        'stepper-active-icon': 'hsl(var(--stepper-active-icon-color-hsl) / <alpha-value>)',
        'stepper-active-text': 'hsl(var(--stepper-active-text-color-hsl) / <alpha-value>)',
        'stepper-completed-bg': 'hsl(var(--stepper-completed-bg-hsl) / <alpha-value>)',
        'stepper-completed-icon': 'hsl(var(--stepper-completed-icon-color-hsl) / <alpha-value>)',
        'stepper-completed-text': 'hsl(var(--stepper-completed-text-color-hsl) / <alpha-value>)',
        'stepper-inactive-bg': 'hsl(var(--stepper-inactive-bg-hsl) / <alpha-value>)',
        'stepper-inactive-icon': 'hsl(var(--stepper-inactive-icon-color-hsl) / <alpha-value>)',
        'stepper-inactive-text': 'hsl(var(--stepper-inactive-text-color-hsl) / <alpha-value>)',

        // Section Card Specific Colors (How It Works & Features)
        'section-card-bg': 'hsl(var(--section-card-bg-hsl) / <alpha-value>)',
        'section-card-border': 'hsl(var(--section-card-border-hsl) / <alpha-value>)',
        'section-card-icon': 'hsl(var(--section-card-icon-color-hsl) / <alpha-value>)',
        'section-card-text-primary': 'hsl(var(--section-card-text-primary-hsl) / <alpha-value>)',
        'section-card-text-secondary': 'hsl(var(--section-card-text-secondary-hsl) / <alpha-value>)',
        'section-card-icon-bg-hiw-1': 'hsl(var(--section-card-icon-container-bg-how-it-works-1-hsl) / <alpha-value>)',
        'section-card-icon-bg-hiw-2': 'hsl(var(--section-card-icon-container-bg-how-it-works-2-hsl) / <alpha-value>)',
        'section-card-icon-bg-hiw-3': 'hsl(var(--section-card-icon-container-bg-how-it-works-3-hsl) / <alpha-value>)',
        'section-card-icon-bg-feat-1': 'hsl(var(--section-card-icon-container-bg-features-1-hsl) / <alpha-value>)',
        'section-card-icon-bg-feat-2': 'hsl(var(--section-card-icon-container-bg-features-2-hsl) / <alpha-value>)',
        'section-card-icon-bg-feat-3': 'hsl(var(--section-card-icon-container-bg-features-3-hsl) / <alpha-value>)',
        'section-card-icon-bg-feat-4': 'hsl(var(--section-card-icon-container-bg-features-4-hsl) / <alpha-value>)'
      },
      backgroundImage: {
        // Update gradients if their constituent colors changed
        'gradient-primary-action': 'var(--gradient-primary-action)', // Now Coral to Green
        // Keep others or update if they used old variables
        'gradient-secondary-action': 'var(--gradient-secondary-action)',
        'gradient-energetic': 'var(--gradient-energetic)',
        'gradient-warm-sunset': 'var(--gradient-warm-sunset)',
        'gradient-cool-sky': 'var(--gradient-cool-sky)',
        'gradient-dopamine-splash': 'var(--gradient-dopamine-splash)',
        'noise': "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.65\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E')",
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
        inner: 'var(--shadow-inner)',
        'glow-primary-action': '0 0 15px 0px hsl(var(--button-primary-glow-hsl))', // Coral/Orange glow
        'glow-spotify': '0 0 15px 0px hsl(var(--button-spotify-glow-hsl))',     // Spotify Green glow
        'glow-youtube': '0 0 15px 0px hsl(var(--button-youtube-glow-hsl))',     // YouTube Red glow
        'glow-secondary-action': '0 0 15px 0px hsl(var(--button-secondary-glow-hsl))', // Dark Teal glow
        // Remove old glow-highlight-yellow/pink if not used
      },
      ringColor: {
        DEFAULT: 'hsl(var(--input-focus-ring-hsl))', // Spotify Green
        'primary-action': 'hsl(var(--brand-primary-action-hsl))', // Coral/Orange
        spotify: 'hsl(var(--spotify-base-color-hsl))',
        youtube: 'hsl(var(--youtube-base-color-hsl))',
        // 'secondary-action' can be kept if still used
      },
      keyframes: {
        "trail": {
          "0%": { "--angle": "0deg" },
          "100%": { "--angle": "360deg" },
        },
        "fadeIn": {
          "from": { opacity: 0, transform: "translateY(10px)" },
          "to": { opacity: 1, transform: "translateY(0)" },
        },
        "bg-position": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "bounce-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-15px)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: 0.8, transform: "scale(0.98)" },
          "50%": { opacity: 1, transform: "scale(1.02)" },
        },
        "shimmer": {
          "100%": { transform: "translateX(100%)" }
        }
      },
      animation: {
        "trail": "trail 8s linear infinite",
        "fadeIn": "fadeIn 0.5s ease-out",
        "bg-position": "bg-position 3s ease infinite",
        "bounce-slow": "bounce-slow 3s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "pulse-slow": "pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 1.5s ease-in-out infinite"
      },
      fontFamily: {
        'display': ['Montserrat', 'system-ui', 'sans-serif'],
        'sans': ['Inter var', 'Inter', 'system-ui', 'sans-serif'],
        'sf-pro': ['SF Pro Display', 'SF Pro Text', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'sf-pro-display': ['SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'sf-pro-text': ['SF Pro Text', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'apple-system': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
} 
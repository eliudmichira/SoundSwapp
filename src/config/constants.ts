export const UI_CONSTANTS = {
  // Timeouts
  TOAST_DURATION: 4000,
  LOADING_TIMEOUT: 10000,
  DEBOUNCE_DELAY: 300,
  
  // Animation durations
  TRANSITION_DURATION: 300,
  HOVER_DURATION: 200,
  
  // Sizes
  CARD_HEIGHT: 120,
  BUTTON_HEIGHT: 48,
  ICON_SIZE: 24,
  
  // Colors
  PRIMARY_COLOR: '#6366f1',
  SUCCESS_COLOR: '#10b981',
  WARNING_COLOR: '#f59e0b',
  ERROR_COLOR: '#ef4444',
  INFO_COLOR: '#3b82f6',
  
  // Spacing
  SPACING: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
  }
};

export const API_ENDPOINTS = {
  SPOTIFY_AUTH: '/api/spotify/auth',
  YOUTUBE_AUTH: '/api/youtube/auth',
  SOUNDCLOUD_AUTH: '/api/soundcloud/auth',
  CONVERSION: '/api/conversion',
  HISTORY: '/api/history',
  PROFILE: '/api/profile'
};

export const STORAGE_KEYS = {
  USER_PREFERENCES: 'soundswapp_user_preferences',
  CONVERSION_HISTORY: 'soundswapp_conversion_history',
  AUTH_TOKENS: 'soundswapp_auth_tokens',
  UI_STATE: 'soundswapp_ui_state'
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  AUTH_ERROR: 'Authentication failed. Please try again.',
  CONVERSION_ERROR: 'Conversion failed. Please try again.',
  INVALID_URL: 'Invalid playlist URL. Please check the format.',
  RATE_LIMIT: 'Rate limit exceeded. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.'
}; 
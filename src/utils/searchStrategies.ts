// Smart search strategies for failed tracks
// Specifically designed for hip-hop/rap tracks that often have conversion issues

export interface SearchStrategy {
  name: string;
  description: string;
  queries: string[];
  platforms: ('youtube' | 'spotify')[];
}

export const generateSearchStrategies = (track: { name: string; artists: string[] }): SearchStrategy[] => {
  const strategies: SearchStrategy[] = [];
  const artist = track.artists[0];
  const title = track.name;
  
  // Clean the title and artist names
  const cleanTitle = title
    .replace(/\(feat\.?.*?\)/gi, '')
    .replace(/\(Explicit.*?\)/gi, '')
    .replace(/\(Album Version\)/gi, '')
    .replace(/\(Clean.*?\)/gi, '')
    .replace(/\(Radio Edit\)/gi, '')
    .replace(/\(Remix\)/gi, '')
    .trim();
  
  const cleanArtist = artist
    .replace(/\(feat\.?.*?\)/gi, '')
    .replace(/feat\.?/gi, '')
    .trim();

  // Strategy 1: Basic variations
  strategies.push({
    name: 'Basic Search',
    description: 'Standard artist and title combinations',
    queries: [
      `${cleanArtist} ${cleanTitle}`,
      `${cleanTitle} ${cleanArtist}`,
      `${cleanArtist} - ${cleanTitle}`,
      `"${cleanArtist}" "${cleanTitle}"`
    ],
    platforms: ['youtube', 'spotify']
  });

  // Strategy 2: Main artist only (for featured tracks)
  if (artist.includes('feat') || artist.includes('(')) {
    const mainArtist = artist.split(/feat\.?|\(/i)[0].trim();
    strategies.push({
      name: 'Main Artist Only',
      description: 'Search using only the main artist name',
      queries: [
        `${mainArtist} ${cleanTitle}`,
        `${cleanTitle} ${mainArtist}`,
        `${mainArtist} - ${cleanTitle}`
      ],
      platforms: ['youtube', 'spotify']
    });
  }

  // Strategy 3: Title variations
  if (cleanTitle.includes('(')) {
    const mainTitle = cleanTitle.split('(')[0].trim();
    strategies.push({
      name: 'Main Title Only',
      description: 'Search using only the main title without parentheses',
      queries: [
        `${cleanArtist} ${mainTitle}`,
        `${mainTitle} ${cleanArtist}`,
        `${cleanArtist} - ${mainTitle}`
      ],
      platforms: ['youtube', 'spotify']
    });
  }

  // Strategy 4: Explicit content variations
  if (title.toLowerCase().includes('explicit')) {
    const nonExplicitTitle = cleanTitle.replace(/explicit/gi, '').trim();
    strategies.push({
      name: 'Non-Explicit Version',
      description: 'Search without explicit content indicators',
      queries: [
        `${cleanArtist} ${nonExplicitTitle}`,
        `${nonExplicitTitle} ${cleanArtist}`,
        `${cleanArtist} - ${nonExplicitTitle}`
      ],
      platforms: ['youtube', 'spotify']
    });
  }

  // Strategy 5: Live/Remix variations
  strategies.push({
    name: 'Live & Remix Versions',
    description: 'Search for live performances or remixes',
    queries: [
      `${cleanArtist} ${cleanTitle} live`,
      `${cleanArtist} ${cleanTitle} remix`,
      `${cleanTitle} ${cleanArtist} live`,
      `${cleanTitle} ${cleanArtist} remix`
    ],
    platforms: ['youtube']
  });

  // Strategy 6: Cover versions
  strategies.push({
    name: 'Cover Versions',
    description: 'Search for cover versions by other artists',
    queries: [
      `${cleanTitle} cover`,
      `${cleanTitle} by ${cleanArtist} cover`,
      `cover ${cleanTitle}`
    ],
    platforms: ['youtube']
  });

  // Strategy 7: Acronym variations (for artists like F.L.Y.)
  if (artist.includes('.') || artist.includes('(')) {
    const acronym = artist.replace(/[^A-Z]/g, '');
    if (acronym.length > 1) {
      strategies.push({
        name: 'Acronym Search',
        description: 'Search using artist acronym',
        queries: [
          `${acronym} ${cleanTitle}`,
          `${cleanTitle} ${acronym}`,
          `${acronym} - ${cleanTitle}`
        ],
        platforms: ['youtube', 'spotify']
      });
    }
  }

  // Strategy 8: Partial title search
  if (cleanTitle.length > 10) {
    const words = cleanTitle.split(' ');
    if (words.length > 2) {
      const partialTitle = words.slice(0, 2).join(' ');
      strategies.push({
        name: 'Partial Title',
        description: 'Search using first few words of the title',
        queries: [
          `${cleanArtist} ${partialTitle}`,
          `${partialTitle} ${cleanArtist}`,
          `${cleanArtist} - ${partialTitle}`
        ],
        platforms: ['youtube', 'spotify']
      });
    }
  }

  return strategies;
};

// Specific strategies for the failed tracks you mentioned
export const getSpecificStrategies = (trackName: string): SearchStrategy[] => {
  const strategies: SearchStrategy[] = [];
  
  switch (trackName.toLowerCase()) {
    case 'life we live':
      strategies.push({
        name: 'Project Pat Variations',
        description: 'Try different Project Pat name variations',
        queries: [
          'Project Pat Life We Live',
          'Project Pat - Life We Live',
          'Pat Life We Live',
          'Life We Live Project Pat'
        ],
        platforms: ['youtube', 'spotify']
      });
      break;
      
    case 'cheese and dope':
      strategies.push({
        name: 'Project Pat Cheese and Dope',
        description: 'Search for this specific Project Pat track',
        queries: [
          'Project Pat Cheese and Dope',
          'Project Pat - Cheese and Dope',
          'Cheese and Dope Project Pat',
          'Pat Cheese and Dope'
        ],
        platforms: ['youtube', 'spotify']
      });
      break;
      
    case 'swag surfin\'':
      strategies.push({
        name: 'F.L.Y. Variations',
        description: 'Try different F.L.Y. name variations',
        queries: [
          'F.L.Y. Swag Surfin',
          'FLY Swag Surfin',
          'Fast Life Yungstaz Swag Surfin',
          'Swag Surfin F.L.Y.',
          'Swag Surfin FLY'
        ],
        platforms: ['youtube', 'spotify']
      });
      break;
      
    case 'cause i\'m a playa':
      strategies.push({
        name: 'Project Pat Cause I\'m A Playa',
        description: 'Search for this specific Project Pat track',
        queries: [
          'Project Pat Cause I\'m A Playa',
          'Project Pat - Cause I\'m A Playa',
          'Cause I\'m A Playa Project Pat',
          'Pat Cause I\'m A Playa'
        ],
        platforms: ['youtube', 'spotify']
      });
      break;
  }
  
  return strategies;
};

// Helper function to generate YouTube search URLs
export const generateYouTubeSearchUrl = (query: string): string => {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
};

// Helper function to generate Spotify search URLs
export const generateSpotifySearchUrl = (query: string): string => {
  return `https://open.spotify.com/search/${encodeURIComponent(query)}`;
};

// Helper function to extract YouTube video ID from URL
export const extractYouTubeVideoId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// Helper function to extract Spotify track URI from URL
export const extractSpotifyTrackUri = (url: string): string | null => {
  const regex = /spotify\.com\/track\/([a-zA-Z0-9]+)/;
  const match = url.match(regex);
  return match ? `spotify:track:${match[1]}` : null;
}; 
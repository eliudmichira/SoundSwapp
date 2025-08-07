import { SpotifyTrack } from './ConversionContext';

// Helper function to clean YouTube titles and extract artist/song info
export const parseYouTubeTitle = (videoTitle: string, channelTitle: string) => {
  // Remove common YouTube suffixes
  const cleanTitle = videoTitle
    .replace(/\s*\([^)]*\)/g, '') // Remove (Official Video), (Lyrics), etc.
    .replace(/\s*\[[^\]]*\]/g, '') // Remove [Official Video], [Lyrics], etc.
    .replace(/\s*\|[^|]*$/g, '') // Remove | Electronic, | Trap, etc.
    .replace(/\s*【[^】]*】/g, '') // Remove 【Melodic Dubstep】, etc.
    .replace(/\s*♫[^♫]*♫/g, '') // Remove ♫ Best of... ♫
    .replace(/\s*feat\./gi, ' ft. ') // Standardize featuring
    .replace(/\s*ft\./gi, ' ft. ') // Standardize ft.
    .trim();

  // Try to extract artist and song from title
  const separators = [' - ', ' – ', ': ', ' "', " '", ' // ', ' | '];
  let artist = channelTitle;
  let song = cleanTitle;

  for (const separator of separators) {
    if (cleanTitle.includes(separator)) {
      const parts = cleanTitle.split(separator);
      if (parts.length >= 2) {
        artist = parts[0].trim();
        song = parts.slice(1).join(separator).trim()
          .replace(/^['"]/, '')
          .replace(/['"]$/, '');
        break;
      }
    }
  }

  // Clean up the song title
  song = song
    .replace(/^\d+\s*[-–]\s*/, '') // Remove "1 - " from start
    .replace(/\s*\([^)]*\)/g, '') // Remove remaining parentheses
    .replace(/\s*\[[^\]]*\]/g, '') // Remove remaining brackets
    .trim();

  return { artist, song };
};

// Improved similarity calculation for YouTube to Spotify conversion
export const calculateTrackSimilarity = (originalTrack: SpotifyTrack, spotifyTrack: any): number => {
  let score = 0;
  
  // Normalize strings for comparison
  const normalize = (str: string) => str.toLowerCase().replace(/[^\w\s]/g, '').trim();
  
  const originalTitle = normalize(originalTrack.name);
  const originalArtist = normalize(originalTrack.artists[0]);
  const spotifyTitle = normalize(spotifyTrack.name);
  const spotifyArtist = normalize(spotifyTrack.artists[0].name);
  
  // Title similarity (50% weight)
  if (originalTitle === spotifyTitle) {
    score += 0.5;
  } else if (spotifyTitle.includes(originalTitle) || originalTitle.includes(spotifyTitle)) {
    score += 0.4;
  } else {
    // Calculate partial similarity
    const titleWords = originalTitle.split(' ');
    const spotifyTitleWords = spotifyTitle.split(' ');
    const commonWords = titleWords.filter(word => spotifyTitleWords.includes(word));
    if (commonWords.length > 0) {
      score += (commonWords.length / Math.max(titleWords.length, spotifyTitleWords.length)) * 0.3;
    }
  }
  
  // Artist similarity (40% weight)
  if (originalArtist === spotifyArtist) {
    score += 0.4;
  } else if (spotifyArtist.includes(originalArtist) || originalArtist.includes(spotifyArtist)) {
    score += 0.3;
  } else {
    // Calculate partial similarity
    const artistWords = originalArtist.split(' ');
    const spotifyArtistWords = spotifyArtist.split(' ');
    const commonWords = artistWords.filter(word => spotifyArtistWords.includes(word));
    if (commonWords.length > 0) {
      score += (commonWords.length / Math.max(artistWords.length, spotifyArtistWords.length)) * 0.2;
    }
  }
  
  // Duration similarity (10% weight) - if we have duration data
  if (originalTrack.duration_ms && spotifyTrack.duration_ms) {
    const durationDiff = Math.abs(originalTrack.duration_ms - spotifyTrack.duration_ms);
    const maxDiff = Math.max(originalTrack.duration_ms, spotifyTrack.duration_ms);
    const durationSimilarity = Math.max(0, 1 - (durationDiff / maxDiff));
    score += durationSimilarity * 0.1;
  }
  
  return Math.min(score, 1.0); // Cap at 1.0
};

// Generate better search queries for YouTube to Spotify conversion
export const generateSearchQueries = (track: SpotifyTrack) => {
  // For YouTube to Spotify conversion, the track data is already processed
  // so we can use the track.name and track.artists directly
  const artist = track.artists[0];
  const song = track.name;
  
  // Clean up the song title
  const cleanSong = song
    .replace(/^\d+\s*[-–]\s*/, '') // Remove "1 - " from start
    .replace(/\s*\([^)]*\)/g, '') // Remove parentheses
    .replace(/\s*\[[^\]]*\]/g, '') // Remove brackets
    .trim();
  
  // Clean up the artist name
  const cleanArtist = artist
    .replace(/\s*\([^)]*\)/g, '') // Remove parentheses
    .replace(/\s*\[[^\]]*\]/g, '') // Remove brackets
    .trim();
  
  return [
    `${cleanArtist} ${cleanSong}`,
    `${cleanSong} ${cleanArtist}`,
    cleanSong,
    `${cleanArtist} - ${cleanSong}`,
    `${cleanArtist} "${cleanSong}"`,
    // Add more specific queries
    `${cleanArtist} ${cleanSong} official`,
    `${cleanArtist} ${cleanSong} audio`,
    `${cleanSong} by ${cleanArtist}`,
    // Try without featured artists
    cleanSong.replace(/\s*ft\.\s*[^,\s]+/gi, '').trim(),
    // Try just the main artist
    `${cleanArtist} ${cleanSong.replace(/\s*ft\.\s*[^,\s]+/gi, '').trim()}`,
    // Try with original data as fallback
    `${artist} ${song}`,
    `${song} ${artist}`,
    song
  ].filter(query => query.length > 0);
}; 
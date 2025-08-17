import { SpotifyTrack } from './ConversionContext';

// Helper to normalize strings: lowercase, remove punctuation/diacritics
const normalize = (str: string) =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}+/gu, '')
    .replace(/[“”"'`]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .trim();

// Helper to clean YouTube/track titles
export const parseYouTubeTitle = (videoTitle: string, channelTitle: string) => {
  // Remove common YouTube suffixes
  const cleanTitle = videoTitle
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/\s*\[[^\]]*\]/g, '')
    .replace(/\s*\|[^|]*$/g, '')
    .replace(/\s*【[^】]*】/g, '')
    .replace(/\s*feat\./gi, ' ft. ')
    .replace(/\s*ft\./gi, ' ft. ')
    .trim();

  const separators = [' - ', ' – ', ': ', ' "', " '", ' // ', ' | '];
  let artist = channelTitle;
  let song = cleanTitle;

  for (const separator of separators) {
    if (cleanTitle.includes(separator)) {
      const parts = cleanTitle.split(separator);
      if (parts.length >= 2) {
        artist = parts[0].trim();
        song = parts
          .slice(1)
          .join(separator)
          .replace(/^['"]/, '')
          .replace(/['"]$/, '')
          .trim();
        break;
      }
    }
  }

  // Clean up the song title
  song = song
    .replace(/^\d+\s*[-–]\s*/, '')
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/\s*\[[^\]]*\]/g, '')
    .trim();

  return { artist, song };
};

// Improved similarity calculation for YouTube to Spotify conversion
export const calculateTrackSimilarity = (originalTrack: SpotifyTrack, spotifyTrack: any): number => {
  let score = 0;

  const stripFeaturing = (s: string) => s.replace(/\s+(ft\.|feat\.|featuring)\s+.*$/i, '').trim();

  const originalTitle = normalize(stripFeaturing(originalTrack.name));
  const originalArtist = normalize(stripFeaturing(originalTrack.artists[0]));
  const spotifyTitle = normalize(stripFeaturing(spotifyTrack.name));
  const spotifyArtist = normalize(stripFeaturing(spotifyTrack.artists[0].name));

  // Title similarity (45% weight)
  if (originalTitle === spotifyTitle) {
    score += 0.45;
  } else if (spotifyTitle.includes(originalTitle) || originalTitle.includes(spotifyTitle)) {
    score += 0.35;
  } else {
    const titleWords = originalTitle.split(' ');
    const spotifyTitleWords = spotifyTitle.split(' ');
    const commonWords = titleWords.filter((word) => spotifyTitleWords.includes(word));
    if (commonWords.length > 0) {
      score += (commonWords.length / Math.max(titleWords.length, spotifyTitleWords.length)) * 0.25;
    }
  }

  // Artist similarity (45% weight)
  if (originalArtist === spotifyArtist) {
    score += 0.45;
  } else if (spotifyArtist.includes(originalArtist) || originalArtist.includes(spotifyArtist)) {
    score += 0.35;
  } else {
    const artistWords = originalArtist.split(' ');
    const spotifyArtistWords = spotifyArtist.split(' ');
    const commonWords = artistWords.filter((word) => spotifyArtistWords.includes(word));
    if (commonWords.length > 0) {
      score += (commonWords.length / Math.max(artistWords.length, spotifyArtistWords.length)) * 0.2;
    }
  }

  // Duration tolerance (10% weight)
  if (originalTrack.duration_ms && spotifyTrack.duration_ms) {
    const diff = Math.abs(originalTrack.duration_ms - spotifyTrack.duration_ms);
    const toleranceMs = Math.max(8000, Math.floor(originalTrack.duration_ms * 0.05));
    const durationSimilarity = diff <= toleranceMs ? 1 : Math.max(0, 1 - diff / (originalTrack.duration_ms * 2));
    score += durationSimilarity * 0.1;
  }

  // Bonus for official/non-live when names match
  const titleRaw = (spotifyTrack.name || '').toLowerCase();
  if (titleRaw.includes('live') || titleRaw.includes('remix')) {
    score -= 0.05;
  }
  score = Math.max(0, Math.min(score, 1));
  return score;
};

// Generate better search queries for YouTube to Spotify conversion
export const generateSearchQueries = (track: SpotifyTrack) => {
  const artist = stripFeaturingSafe(track.artists[0]);
  const song = stripFeaturingSafe(track.name);

  const cleanSong = song
    .replace(/^\d+\s*[-–]\s*/, '')
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/\s*\[[^\]]*\]/g, '')
    .trim();

  const cleanArtist = artist
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/\s*\[[^\]]*\]/g, '')
    .trim();

  return [
    `${cleanArtist} ${cleanSong}`,
    `${cleanSong} ${cleanArtist}`,
    cleanSong,
    `${cleanArtist} - ${cleanSong}`,
    `${cleanArtist} "${cleanSong}"`,
    `${cleanArtist} ${cleanSong} official`,
    `${cleanArtist} ${cleanSong} audio`,
    `${cleanSong} by ${cleanArtist}`,
    cleanSong.replace(/\s*ft\.?\s*[^,\s]+/gi, '').trim(),
    `${cleanArtist} ${cleanSong.replace(/\s*ft\.?\s*[^,\s]+/gi, '').trim()}`,
    `${artist} ${song}`,
    `${song} ${artist}`,
    song,
  ].filter((q) => q.length > 0);
};

const stripFeaturingSafe = (s: string) => s.replace(/\s+(ft\.|feat\.|featuring)\s+.*$/i, '').trim(); 
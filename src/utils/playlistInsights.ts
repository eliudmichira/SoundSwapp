import { PlaylistTypes } from '../types/playlist';

// Use shared types
type PlaylistStats = PlaylistTypes.PlaylistStats;

interface ConversionTrack {
  name: string;
  artists: string[];
  popularity?: number;
  duration_ms?: number;
  explicit?: boolean;
  album?: string;
  releaseYear?: string | number;
  genres?: string[];
  artistImages?: string[];
}

// Convert track to the correct type
const convertTrack = (track: ConversionTrack): PlaylistTypes.Track => ({
  name: track.name,
  artists: track.artists,
  popularity: track.popularity,
  duration_ms: track.duration_ms,
  explicit: track.explicit,
  album: track.album,
  releaseYear: track.releaseYear ? Number(track.releaseYear) : undefined,
  genres: track.genres,
  artistImages: track.artistImages
});

// Generate a consistent color for a genre
const generateGenreColor = (genre: string): string => {
  // Create a hash of the genre name
  let hash = 0;
  for (let i = 0; i < genre.length; i++) {
    hash = genre.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Convert to HSL color
  const h = Math.abs(hash % 360);
  return `hsl(${h}, 70%, 50%)`;
};

// Function to get playlist insights from the tracks data
export const generatePlaylistInsights = (tracks: ConversionTrack[]): PlaylistStats => {
  const artistCounts: Record<string, number> = {};
  const artistImages: Record<string, string> = {};
  const genreCounts: Record<string, number> = {};
  const yearCounts: Record<string, number> = {};
  const albumCounts: Record<string, number> = {};
  const genres = new Set<string>();
  let totalTracks = tracks.length;
  let explicitCount = 0;
  let nonExplicitCount = 0;
  let validPopularityCount = 0;
  let totalPopularity = 0;
  let totalDuration = 0;
  let longestTrackDuration = 0;
  let shortestTrackDuration = Infinity;
  let longestTrack: ConversionTrack | null = null;
  let shortestTrack: ConversionTrack | null = null;
  let mostPopularTrack: ConversionTrack | null = null;
  let leastPopularTrack: ConversionTrack | null = null;
  let highestPopularity = 0;
  let lowestPopularity = 100;
  let oldestYear = '9999';
  let newestYear = '0';
  let oldestTrack: ConversionTrack | null = null;
  let newestTrack: ConversionTrack | null = null;
  
  // Duration categories
  const durationCategories = {
    short: 0, // < 3 min
    medium: 0, // 3-5 min
    long: 0, // > 5 min
  };
  
  // Popularity ranges
  const popularityRanges = {
    low: 0, // 0-33
    medium: 0, // 34-66
    high: 0, // 67-100
  };
  
  // Process each track
  tracks.forEach(track => {
    // Process artists
    track.artists.forEach((artist, index) => {
      artistCounts[artist] = (artistCounts[artist] || 0) + 1;
      if (track.artistImages?.[index] && !artistImages[artist]) {
        artistImages[artist] = track.artistImages[index];
      }
    });
    
    // Process genres
    if (track.genres) {
      track.genres.forEach(genre => {
        genres.add(genre);
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    }
    
    // Process duration
    if (track.duration_ms) {
      totalDuration += track.duration_ms;
      const durationMinutes = track.duration_ms / 1000 / 60;
      if (durationMinutes < 3) durationCategories.short++;
      else if (durationMinutes <= 5) durationCategories.medium++;
      else durationCategories.long++;
      
      if (track.duration_ms > longestTrackDuration) {
        longestTrackDuration = track.duration_ms;
        longestTrack = track;
      }
      if (track.duration_ms < shortestTrackDuration) {
        shortestTrackDuration = track.duration_ms;
        shortestTrack = track;
      }
    }
    
    // Process popularity
    if (track.popularity !== undefined) {
      totalPopularity += track.popularity;
      validPopularityCount++;
      if (track.popularity <= 33) popularityRanges.low++;
      else if (track.popularity <= 66) popularityRanges.medium++;
      else popularityRanges.high++;
      
      if (track.popularity > highestPopularity) {
        highestPopularity = track.popularity;
        mostPopularTrack = track;
      }
      if (track.popularity < lowestPopularity) {
        lowestPopularity = track.popularity;
        leastPopularTrack = track;
      }
    }
    
    // Process release year
    if (track.releaseYear) {
      const year = track.releaseYear.toString();
      yearCounts[year] = (yearCounts[year] || 0) + 1;
      if (year < oldestYear) {
        oldestYear = year;
        oldestTrack = track;
      }
      if (year > newestYear) {
        newestYear = year;
        newestTrack = track;
      }
    }
    
    // Process explicit content
    if (track.explicit) explicitCount++;
    else nonExplicitCount++;
    
    // Process albums
    if (track.album) {
      albumCounts[track.album] = (albumCounts[track.album] || 0) + 1;
    }
  });
  
  // Calculate genre percentages
  const genrePercentages: Record<string, number> = {};
  const totalGenreMentions = Object.values(genreCounts).reduce((a, b) => a + b, 0);
  Object.entries(genreCounts).forEach(([genre, count]) => {
    genrePercentages[genre] = (count / totalGenreMentions) * 100;
  });
  
  // Calculate yearly trends
  const yearlyTrends = Object.entries(yearCounts)
    .map(([year, count]) => ({
      year,
      count,
      avgPopularity: tracks
        .filter(t => t.releaseYear?.toString() === year && t.popularity !== undefined)
        .reduce((acc, t) => acc + (t.popularity || 0), 0) / count
    }))
    .sort((a, b) => a.year.localeCompare(b.year));
  
  // Calculate decade distribution
  const decadeDistribution: Record<string, number> = {};
  Object.entries(yearCounts).forEach(([year, count]) => {
    const decade = year.slice(0, 3) + '0';
    decadeDistribution[decade] = (decadeDistribution[decade] || 0) + count;
  });
  
  // Convert genres to array with colors
  const genreArray = Array.from(genres).map(name => ({
    name,
    count: genreCounts[name],
    color: generateGenreColor(name),
    percentage: genrePercentages[name]
  })).sort((a, b) => b.count - a.count);
  
  // Convert artists to array with images
  const artistArray = Object.entries(artistCounts)
    .map(([name, count]) => ({
      name,
      count,
      image: artistImages[name],
      popularity: tracks.find(t => t.artists.includes(name))?.popularity
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 artists
  
  // Convert albums to array
  const albumArray = Object.entries(albumCounts)
    .map(([name, trackCount]) => {
      const track = tracks.find(t => t.album === name);
      const year = track?.releaseYear ? Number(track.releaseYear) : undefined;
      return { 
        name, 
        trackCount,
        year: !isNaN(year as number) ? year : undefined
      };
    })
    .sort((a, b) => b.trackCount - a.trackCount)
    .slice(0, 5); // Top 5 albums
  
  return {
    totalTracks,
    avgPopularity: validPopularityCount ? totalPopularity / validPopularityCount : 0,
    totalDuration: Math.round(totalDuration / 60000), // Convert to minutes
    genres: genreArray,
    topArtists: artistArray,
    releaseYears: yearCounts,
    totalGenreMentions,
    mostPopularTrack: mostPopularTrack ? convertTrack(mostPopularTrack) : undefined,
    leastPopularTrack: leastPopularTrack ? convertTrack(leastPopularTrack) : undefined,
    longestTrack: longestTrack ? convertTrack(longestTrack) : undefined,
    shortestTrack: shortestTrack ? convertTrack(shortestTrack) : undefined,
    explicitCount,
    nonExplicitCount,
    topAlbums: albumArray,
    avgTrackLength: totalDuration / totalTracks,
    oldestTrack: oldestTrack ? convertTrack(oldestTrack) : undefined,
    newestTrack: newestTrack ? convertTrack(newestTrack) : undefined,
    explicitPercentage: (explicitCount / totalTracks) * 100,
    uniqueArtists: Object.keys(artistCounts).length,
    uniqueAlbums: Object.keys(albumCounts).length,
    decadeDistribution,
    // New fields
    genrePercentages,
    yearlyTrends,
    durationCategories,
    popularityRanges,
  };
}; 
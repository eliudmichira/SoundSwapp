import { ConversionTrack, Track } from '../types/conversion';

export const convertTrack = (track: ConversionTrack): Track => ({
  name: track.name,
  artists: track.artists,
  popularity: track.popularity,
  duration_ms: track.duration_ms,
  explicit: track.explicit,
  album: track.album,
  releaseYear: track.releaseYear,
  genres: track.genres,
  artistImages: track.artistImages
});

export const generateGenreColor = (genre: string): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
  ];
  
  const hash = genre.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  return colors[Math.abs(hash) % colors.length];
};

export const generatePlaylistInsights = (tracks: ConversionTrack[]): any => {
  if (!tracks || tracks.length === 0) {
    return {
      totalTracks: 0,
      totalDuration: 0,
      averagePopularity: 0,
      genres: [],
      artists: [],
      albums: [],
      explicitCount: 0,
      releaseYears: []
    };
  }

  const insights = {
    totalTracks: tracks.length,
    totalDuration: tracks.reduce((sum, track) => sum + (track.duration_ms || 0), 0),
    averagePopularity: tracks.reduce((sum, track) => sum + (track.popularity || 0), 0) / tracks.length,
    genres: [] as any[],
    artists: [] as any[],
    albums: [] as any[],
    explicitCount: tracks.filter(track => track.explicit).length,
    releaseYears: [] as any[]
  };

  // Process genres
  const genreCounts: { [key: string]: number } = {};
  tracks.forEach(track => {
    if (track.genres) {
      track.genres.forEach(genre => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    }
  });

  insights.genres = Object.entries(genreCounts)
    .map(([name, count]) => ({ name, count, color: generateGenreColor(name) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Process artists
  const artistCounts: { [key: string]: number } = {};
  tracks.forEach(track => {
    track.artists.forEach(artist => {
      artistCounts[artist] = (artistCounts[artist] || 0) + 1;
    });
  });

  insights.artists = Object.entries(artistCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Process albums
  const albumCounts: { [key: string]: number } = {};
  tracks.forEach(track => {
    if (track.album) {
      albumCounts[track.album] = (albumCounts[track.album] || 0) + 1;
    }
  });

  insights.albums = Object.entries(albumCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Process release years
  const yearCounts: { [key: string]: number } = {};
  tracks.forEach(track => {
    if (track.releaseYear) {
      const year = track.releaseYear.toString();
      yearCounts[year] = (yearCounts[year] || 0) + 1;
    }
  });

  insights.releaseYears = Object.entries(yearCounts)
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => parseInt(a.year) - parseInt(b.year));

  return insights;
};

export const calculateDistributionArray = (values: number[], buckets: number): { range: string; count: number }[] => {
  if (values.length === 0) return [];

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  const bucketSize = range / buckets;

  const distribution = new Array(buckets).fill(0).map(() => ({ range: '', count: 0 }));

  values.forEach(value => {
    const bucketIndex = Math.min(Math.floor((value - min) / bucketSize), buckets - 1);
    distribution[bucketIndex].count++;
  });

  distribution.forEach((bucket, index) => {
    const start = min + (index * bucketSize);
    const end = min + ((index + 1) * bucketSize);
    bucket.range = `${Math.round(start)}-${Math.round(end)}`;
  });

  return distribution;
};

export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}; 
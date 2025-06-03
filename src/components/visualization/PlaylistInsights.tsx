import { useState, useEffect } from 'react';
import { 
  Music, 
  Clock, 
  Flame, 
  Users, 
  ChevronsUpDown,
  Info,
  Disc
} from 'lucide-react';

interface Genre {
  name: string;
  count: number;
  color: string;
}

interface Artist {
  name: string;
  count: number;
  image?: string;
}

export interface PlaylistInsightsProps {
  stats: {
    totalTracks: number;
    avgPopularity: number;
    totalDuration: number;
    genres: Genre[];
    topArtists: Artist[];
    releaseYears: { [key: string]: number } | Record<string, number>;
    totalGenreMentions?: number;
    mostPopularTrack?: { name: string; artists?: string[]; popularity: number };
    leastPopularTrack?: { name: string; artists?: string[]; popularity: number };
    longestTrack?: { name: string; artists?: string[]; duration_ms: number };
    shortestTrack?: { name: string; artists?: string[]; duration_ms: number };
    explicitCount?: number;
    nonExplicitCount?: number;
    topAlbums?: { name: string; count: number }[];
  };
}

export function PlaylistInsights({ stats }: PlaylistInsightsProps) {
  const [activeTab, setActiveTab] = useState<string>('genres');
  const [isInfoVisible, setIsInfoVisible] = useState<boolean>(false);

  // Animation for stats cards when they load
  useEffect(() => {
    const statsCards = document.querySelectorAll('.stats-card');
    statsCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('opacity-100', 'translate-y-0');
      }, 100 * index);
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="relative px-6 pt-6 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Disc className="h-5 w-5 bg-gradient-to-r from-green-400 to-red-500 text-transparent bg-clip-text" strokeWidth={1.5} />
              Playlist Insights
              <button 
                className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                onClick={() => setIsInfoVisible(!isInfoVisible)}
              >
                <Info size={16} className="h-5 w-5 bg-gradient-to-r from-green-400 to-red-500 text-transparent bg-clip-text" />
              </button>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Generated from your playlist data</p>
          </div>
          
          {/* Additional data selector */}
          <div className="hidden md:flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full px-4 py-1.5 shadow-sm border border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Last updated:</span>
            <span className="text-sm text-gray-800 dark:text-white">Today</span>
            <ChevronsUpDown size={14} className="text-gray-400 ml-1" />
          </div>
        </div>
        
        {/* Info tooltip */}
        {isInfoVisible && (
          <div className="absolute top-16 left-6 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-sm border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300">
            <p>
              These insights are generated based on Spotify data for the tracks in your playlist.
              Popularity scores range from 0-100, with 100 being the most popular.
              Duration is shown in minutes.
            </p>
          </div>
        )}
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 pb-6">
        {/* Total Tracks */}
        <div className="stats-card bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-all transform opacity-0 translate-y-4 duration-300">
          <div className="flex items-start">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full mr-3">
              <Music className="h-5 w-5 bg-gradient-to-r from-green-400 to-red-500 text-transparent bg-clip-text" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tracks</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTracks}</p>
            </div>
          </div>
        </div>
        
        {/* Average Popularity */}
        <div className="stats-card bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-all transform opacity-0 translate-y-4 duration-300">
          <div className="flex items-start">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full mr-3">
              <Flame className="h-5 w-5 bg-gradient-to-r from-green-400 to-red-500 text-transparent bg-clip-text" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Popularity</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgPopularity}</p>
            </div>
          </div>
        </div>
        
        {/* Total Duration */}
        <div className="stats-card bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-all transform opacity-0 translate-y-4 duration-300">
          <div className="flex items-start">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-3">
              <Clock className="h-5 w-5 bg-gradient-to-r from-green-400 to-red-500 text-transparent bg-clip-text" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Duration</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalDuration} {stats.totalDuration === 1 ? 'min' : 'mins'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* New: Detailed Stats Section */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Most/Least Popular Track */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Most Popular Track</h4>
            {stats.mostPopularTrack ? (
              <div>
                <span className="font-medium">{stats.mostPopularTrack.name}</span> by {stats.mostPopularTrack.artists?.join(', ')}
                <span className="ml-2 text-xs text-gray-500">(Popularity: {stats.mostPopularTrack.popularity})</span>
              </div>
            ) : <span className="text-gray-400">N/A</span>}
            <h4 className="font-semibold text-gray-800 dark:text-white mt-4 mb-2">Least Popular Track</h4>
            {stats.leastPopularTrack ? (
              <div>
                <span className="font-medium">{stats.leastPopularTrack.name}</span> by {stats.leastPopularTrack.artists?.join(', ')}
                <span className="ml-2 text-xs text-gray-500">(Popularity: {stats.leastPopularTrack.popularity})</span>
              </div>
            ) : <span className="text-gray-400">N/A</span>}
          </div>
          {/* Longest/Shortest Track */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Longest Track</h4>
            {stats.longestTrack ? (
              <div>
                <span className="font-medium">{stats.longestTrack.name}</span> by {stats.longestTrack.artists?.join(', ')}
                <span className="ml-2 text-xs text-gray-500">(Duration: {Math.round(stats.longestTrack.duration_ms / 1000 / 60 * 10) / 10} min)</span>
              </div>
            ) : <span className="text-gray-400">N/A</span>}
            <h4 className="font-semibold text-gray-800 dark:text-white mt-4 mb-2">Shortest Track</h4>
            {stats.shortestTrack ? (
              <div>
                <span className="font-medium">{stats.shortestTrack.name}</span> by {stats.shortestTrack.artists?.join(', ')}
                <span className="ml-2 text-xs text-gray-500">(Duration: {Math.round(stats.shortestTrack.duration_ms / 1000 / 60 * 10) / 10} min)</span>
              </div>
            ) : <span className="text-gray-400">N/A</span>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Explicit/Non-Explicit Count */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Explicit Content</h4>
            <div className="flex gap-4">
              <span className="text-red-500 font-bold">Explicit: {stats.explicitCount ?? 0}</span>
              <span className="text-green-600 font-bold">Non-Explicit: {stats.nonExplicitCount ?? 0}</span>
            </div>
          </div>
          {/* Top Albums */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Top Albums</h4>
            {stats.topAlbums && stats.topAlbums.length > 0 ? (
              <ul className="list-disc pl-5">
                {stats.topAlbums.map((album, i) => (
                  <li key={i} className="text-gray-700 dark:text-gray-200">
                    <span className="font-medium">{album.name}</span> <span className="text-xs text-gray-500">({album.count} tracks)</span>
                  </li>
                ))}
              </ul>
            ) : <span className="text-gray-400">N/A</span>}
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="px-6 pb-6">
        <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'genres' 
                ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-500' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
            onClick={() => setActiveTab('genres')}
          >
            Genres
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'artists' 
                ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-500' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
            onClick={() => setActiveTab('artists')}
          >
            Artists
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'years' 
                ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-500' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
            onClick={() => setActiveTab('years')}
          >
            Release Years
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          {/* Genres Tab */}
          {activeTab === 'genres' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Genre Distribution</h3>
              <div className="space-y-4">
                {stats.genres.map((genre, i) => {
                  // Use totalGenreMentions if provided, otherwise use totalTracks for backward compatibility
                  const denominator = stats.totalGenreMentions || stats.totalTracks;
                  // Make sure the percentage is always between 0-100
                  const percentage = Math.min(100, Math.round((genre.count / denominator) * 100));
                  
                  return (
                    <div key={i} className="relative">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{genre.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: genre.color
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Artists Tab */}
          {activeTab === 'artists' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Top Artists</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats.topArtists.map((artist, i) => (
                  <div key={i} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    {artist.image ? (
                      <img 
                        src={artist.image} 
                        alt={artist.name} 
                        className="w-12 h-12 rounded-full mr-3 object-cover border-2 border-white dark:border-gray-600"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 mr-3 flex items-center justify-center">
                        <Users className="h-6 w-6 bg-gradient-to-r from-green-400 to-red-500 text-transparent bg-clip-text" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{artist.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{artist.count} track{artist.count !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Years Tab */}
          {activeTab === 'years' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Release Years</h3>
              <div className="space-y-4">
                {Object.entries(stats.releaseYears)
                  .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
                  .map(([year, count], i) => (
                    <div key={i} className="relative">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{year}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {Math.round((count / stats.totalTracks) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-gradient-to-r from-teal-500 to-blue-500" 
                          style={{ 
                            width: `${(count / stats.totalTracks) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Music, 
  Clock, 
  Flame, 
  Users, 
  Info,
  Disc,
  Share2,
  Download,
  TrendingUp,
  Calendar,
  Star,
  PlayCircle,
  Headphones,
  Award,
  Eye,
  BarChart3,
  PieChart,
  Activity,
  Sparkles,
  Zap,
  Heart,
  Volume2,
  Shuffle,
  ChevronsUpDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassmorphicContainer } from '../ui/GlassmorphicContainer';
import { PlaylistTypes } from '../../types/playlist';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

// Use shared types
type Genre = PlaylistTypes.Genre;
type Track = PlaylistTypes.Track;
type Artist = PlaylistTypes.Artist;
type PlaylistInsightsProps = PlaylistTypes.PlaylistInsightsProps;

// Enhanced animations
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleOnHover = {
  whileHover: { scale: 1.05, y: -2 },
  whileTap: { scale: 0.98 }
};

// Enhanced metric calculation
const calculateAdvancedMetrics = (stats: PlaylistInsightsProps['stats']) => {
  const listeningTime = Math.round(stats.totalDuration / 3600000); // Convert ms to hours
  const avgTracksPerArtist = stats.uniqueArtists ? Math.round(stats.totalTracks / stats.uniqueArtists) : 0;
  const diversityScore = stats.genres.length > 0 ? Math.round((stats.genres.length / stats.totalTracks) * 100) : 0;
  const vintageScore = stats.releaseYears ? 
    Math.round((Object.entries(stats.releaseYears)
      .filter(([year]) => parseInt(year) < 2000)
      .reduce((sum, [_, count]) => sum + count, 0) / stats.totalTracks) * 100) : 0;
  
  return {
    listeningTime,
    avgTracksPerArtist,
    diversityScore,
    vintageScore
  };
};

// Enhanced StatCard component
interface StatCardProps {
  icon: React.ComponentType<{ size?: number | string }>;
  title: string;
  value: string | number;
  subtitle?: string;
  color?: 'purple' | 'blue' | 'green' | 'red' | 'yellow' | 'indigo';
  trend?: string;
  onClick?: () => void;
  gradient?: boolean;
}

const StatCard = ({ 
  icon: Icon, 
  title, 
  value, 
  subtitle, 
  color = 'purple', 
  trend,
  onClick,
  gradient = true
}: StatCardProps) => {
  const colorClasses: Record<string, string> = {
    purple: 'from-purple-500 to-pink-500',
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-teal-500',
    red: 'from-red-500 to-orange-500',
    yellow: 'from-yellow-500 to-orange-500',
    indigo: 'from-indigo-500 to-purple-500'
  };

  const bgClasses: Record<string, string> = {
    purple: 'bg-purple-500/10 border-purple-500/20',
    blue: 'bg-blue-500/10 border-blue-500/20',
    green: 'bg-green-500/10 border-green-500/20',
    red: 'bg-red-500/10 border-red-500/20',
    yellow: 'bg-yellow-500/10 border-yellow-500/20',
    indigo: 'bg-indigo-500/10 border-indigo-500/20'
  };

  return (
    <motion.div
      {...scaleOnHover}
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border backdrop-blur-sm cursor-pointer
        ${gradient ? 'bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-800/80 dark:to-gray-900/40' : 'bg-white/60 dark:bg-gray-800/60'}
        ${bgClasses[color]} shadow-lg hover:shadow-xl transition-all duration-300`}
    >
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r ${colorClasses[color]} opacity-0 hover:opacity-5 transition-opacity duration-300`} />
      
      {/* Content */}
      <div className="relative p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${colorClasses[color]} text-white shadow-md`}>
                <Icon size={20} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
                {trend && (
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp size={12} className="text-green-500" />
                    <span className="text-xs text-green-500 font-medium">{trend}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-gray-900 dark:text-white"
              >
                {value}
              </motion.div>
              {subtitle && (
                <div className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced visualization components
interface ModernProgressBarProps {
  label: string;
  value: number;
  max: number;
  color?: 'purple' | 'blue' | 'green' | 'red' | 'yellow' | 'indigo';
  showPercentage?: boolean;
}

const ModernProgressBar = ({ label, value, max, color = 'purple', showPercentage = true }: ModernProgressBarProps) => {
  const percentage = Math.round((value / max) * 100);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        {showPercentage && (
          <span className="text-xs text-gray-500 dark:text-gray-400">{percentage}%</span>
        )}
      </div>
      <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full bg-gradient-to-r ${
            color === 'purple' ? 'from-purple-500 to-pink-500' :
            color === 'blue' ? 'from-blue-500 to-cyan-500' :
            color === 'green' ? 'from-green-500 to-teal-500' :
            color === 'red' ? 'from-red-500 to-orange-500' :
            color === 'yellow' ? 'from-yellow-500 to-orange-500' :
            'from-indigo-500 to-purple-500'
          }`}
        />
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
      </div>
    </div>
  );
};

interface CircularProgressProps {
  percentage: number;
  color?: 'purple' | 'blue' | 'green' | 'red' | 'yellow' | 'indigo';
  size?: number;
  strokeWidth?: number;
}

const CircularProgress = ({ percentage, color = 'purple', size = 60, strokeWidth = 4 }: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-gray-700"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`${
            color === 'purple' ? 'text-purple-500' :
            color === 'blue' ? 'text-blue-500' :
            color === 'green' ? 'text-green-500' :
            color === 'red' ? 'text-red-500' :
            color === 'yellow' ? 'text-yellow-500' :
            'text-indigo-500'
          }`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{percentage}%</span>
      </div>
    </div>
  );
};

// Add SoundSwapp Logo SVG component
const SoundSwappLogo = ({ className = "", size = 36 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="currentColor" className={className}>
    <defs>
      <linearGradient id="soundswapp-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--brand-primary)" />
        <stop offset="35%" stopColor="var(--brand-accent-pink)" />
        <stop offset="100%" stopColor="var(--brand-secondary)" />
      </linearGradient>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1.8" result="blur" />
        <feOffset dy="1" result="offsetBlur" />
        <feMerge>
          <feMergeNode in="offsetBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <pattern id="bg-pattern" patternUnits="userSpaceOnUse" width="10" height="10">
        <path d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
      </pattern>
    </defs>
    
    <circle cx="18" cy="18" r="18" fill="url(#soundswapp-grad)" opacity="0.9" />
    <circle cx="18" cy="18" r="18" fill="url(#bg-pattern)" opacity="0.5"/>

    <g filter="url(#glow)" transform="translate(0.5, 0.5)">
      <path className="ss-letter-main" 
            d="M12.5 23.5 C10 23.5 8.5 21.5 9 19 C9.5 16.5 12.5 15.5 15 15.5 C17.5 15.5 19.5 14 19 11.5 C18.5 9 16.5 7.5 14 7.5" 
            stroke="white" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path className="ss-letter-highlight" 
            d="M12.8 23 C10.5 23 9.3 21.3 9.7 19.2 C10.1 17.1 12.8 16.1 15 16.1 C17.2 16.1 18.8 14.7 18.4 12.5 C18.0 10.3 16.2 8.5 14 8.5"
            stroke="rgba(255,255,255,0.5)" fill="none" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>

      <path className="ss-letter-main" 
            d="M23.5 23.5 C26 23.5 27.5 21.5 27 19 C26.5 16.5 23.5 15.5 21 15.5 C18.5 15.5 16.5 14 17 11.5 C17.5 9 19.5 7.5 22 7.5"
            stroke="white" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path className="ss-letter-highlight" 
            d="M23.2 23 C25.5 23 26.7 21.3 26.3 19.2 C25.9 17.1 23.2 16.1 21 16.1 C18.8 16.1 17.2 14.7 17.6 12.5 C18.0 10.3 19.8 8.5 22 8.5"
            stroke="rgba(255,255,255,0.5)" fill="none" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  </svg>
);

// Enhanced chart options with better styling
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1000,
    easing: 'easeInOutQuart' as const,
  },
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        usePointStyle: true,
        padding: 20,
        color: 'rgb(156, 163, 175)',
        font: {
          size: 12
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: {
        size: 14,
        weight: 'bold' as const,
      },
      bodyFont: {
        size: 13,
      },
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        label: function(context: any) {
          const value = context.raw;
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${context.label}: ${value} (${percentage}%)`;
        }
      }
    },
    datalabels: {
      color: '#fff',
      font: {
        weight: 'bold' as const,
        size: 12
      },
      formatter: (value: number, context: any) => {
        const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
        const percentage = ((value / total) * 100).toFixed(1);
        return `${percentage}%`;
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(156, 163, 175, 0.1)',
      },
      ticks: {
        color: 'rgb(156, 163, 175)',
        font: {
          size: 12
        }
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: 'rgb(156, 163, 175)',
        font: {
          size: 12
        }
      }
    }
  }
};

// Prepare chart data with enhanced styling
const prepareGenreData = (stats: PlaylistTypes.PlaylistStats) => ({
  labels: stats.genres.map(g => g.name),
  datasets: [{
    data: stats.genres.map(g => g.count),
    backgroundColor: stats.genres.map(g => g.color + '80'),
    borderColor: stats.genres.map(g => g.color),
    borderWidth: 2,
    hoverOffset: 4,
  }]
});

const prepareDurationData = (stats: PlaylistTypes.PlaylistStats) => ({
  labels: ['< 3 min', '3-5 min', '> 5 min'],
  datasets: [{
    data: [
      stats.durationCategories?.short || 0,
      stats.durationCategories?.medium || 0,
      stats.durationCategories?.long || 0
    ],
    backgroundColor: [
      'rgba(147, 51, 234, 0.7)',  // Purple
      'rgba(59, 130, 246, 0.7)',  // Blue
      'rgba(236, 72, 153, 0.7)'   // Pink
    ],
    borderColor: [
      'rgb(147, 51, 234)',
      'rgb(59, 130, 246)',
      'rgb(236, 72, 153)'
    ],
    borderWidth: 2
  }]
});

const preparePopularityData = (stats: PlaylistTypes.PlaylistStats) => ({
  labels: ['Low (0-33)', 'Medium (34-66)', 'High (67-100)'],
  datasets: [{
    data: [
      stats.popularityRanges?.low || 0,
      stats.popularityRanges?.medium || 0,
      stats.popularityRanges?.high || 0
    ],
    backgroundColor: [
      'rgba(239, 68, 68, 0.7)',   // Red
      'rgba(245, 158, 11, 0.7)',  // Orange
      'rgba(34, 197, 94, 0.7)'    // Green
    ],
    borderColor: [
      'rgb(239, 68, 68)',
      'rgb(245, 158, 11)',
      'rgb(34, 197, 94)'
    ],
    borderWidth: 2
  }]
});

const prepareYearData = (stats: PlaylistTypes.PlaylistStats) => {
  const years = Object.keys(stats.releaseYears).sort();
  const counts = years.map(year => stats.releaseYears[year]);
  const total = counts.reduce((a, b) => a + b, 0);
  const percentages = counts.map(count => ((count / total) * 100).toFixed(1));

  return {
    labels: years,
    datasets: [{
      label: 'Tracks by Year',
      data: counts,
      borderColor: 'rgb(147, 51, 234)',
      backgroundColor: 'rgba(147, 51, 234, 0.1)',
      borderWidth: 2,
      tension: 0.3,
      fill: true,
      pointBackgroundColor: 'rgb(147, 51, 234)',
      pointBorderColor: '#fff',
      pointHoverRadius: 6,
      pointHoverBackgroundColor: 'rgb(147, 51, 234)',
      pointHoverBorderColor: '#fff'
    }]
  };
};

// Main component
export function EnhancedPlaylistInsights({ stats }: PlaylistInsightsProps) {
  const [activeView, setActiveView] = useState<'overview' | 'genres' | 'artists' | 'timeline' | 'insights'>('overview');
  const [isInfoVisible, setIsInfoVisible] = useState<boolean>(false);
  const [selectedMetric, setSelectedMetric] = useState<'popularity' | 'duration' | 'release'>('popularity');
  const [showTooltip, setShowTooltip] = useState<{ x: number; y: number; content: string } | null>(null);

  const advancedMetrics = calculateAdvancedMetrics(stats);

  return (
    <GlassmorphicContainer className="max-w-7xl mx-auto p-6 space-y-8" rounded="xl">
      {/* Header with enhanced branding */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3">
          <SoundSwappLogo size={48} className="animate-pulse-slow" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent-pink)] bg-clip-text text-transparent">
            Playlist Insights
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Discover the hidden patterns and stories within your music collection with advanced analytics and beautiful visualizations.
        </p>
      </motion.div>

      {/* Navigation with glassmorphic effect */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center"
      >
        <GlassmorphicContainer className="flex p-1" rounded="xl">
          {[
            { key: 'overview', label: 'Overview', icon: BarChart3 },
            { key: 'genres', label: 'Genres', icon: PieChart },
            { key: 'artists', label: 'Artists', icon: Users },
            { key: 'timeline', label: 'Timeline', icon: Calendar },
            { key: 'insights', label: 'Insights', icon: Zap }
          ].map(({ key, label, icon: Icon }) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveView(key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeView === key
                  ? 'bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent-pink)] text-white shadow-md'
                  : 'text-gray-900 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/50 border border-gray-300 dark:border-transparent'
              }`}
            >
              <Icon size={16} />
              <span className="text-sm font-medium">{label}</span>
            </motion.button>
          ))}
        </GlassmorphicContainer>
      </motion.div>

      {/* Content sections with glassmorphic containers */}
      <AnimatePresence mode="wait">
        {activeView === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-8"
          >
            {/* Key Metrics with glassmorphic effect */}
            <motion.div
              variants={staggerChildren}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <GlassmorphicContainer className="relative overflow-hidden" rounded="xl">
                <StatCard
                  icon={Music}
                  title="Total Tracks"
                  value={stats.totalTracks.toLocaleString()}
                  subtitle={`${stats.uniqueArtists || 0} unique artists`}
                  color="purple"
                  trend="+12% vs last month"
                />
              </GlassmorphicContainer>
              <GlassmorphicContainer className="relative overflow-hidden" rounded="xl">
                <StatCard
                  icon={Clock}
                  title="Total Duration"
                  value={`${Math.round(stats.totalDuration / 60)} mins`}
                  color="blue"
                />
              </GlassmorphicContainer>
              <GlassmorphicContainer className="relative overflow-hidden" rounded="xl">
                <StatCard
                  icon={Flame}
                  title="Avg. Popularity"
                  value={Math.round(stats.avgPopularity)}
                  subtitle="Out of 100"
                  color="red"
                />
              </GlassmorphicContainer>
              <GlassmorphicContainer className="relative overflow-hidden" rounded="xl">
                <StatCard
                  icon={Award}
                  title="Diversity Score"
                  value={`${advancedMetrics.diversityScore}%`}
                  subtitle="Genre variety index"
                  color="green"
                />
              </GlassmorphicContainer>
            </motion.div>

            {/* Enhanced Chart Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <span>Playlist Analysis</span>
                  <button 
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() => setShowTooltip(prev => prev ? null : { x: 0, y: 0, content: 'Click on different metrics to explore your playlist data in detail.' })}
                  >
                    <Info size={16} />
                  </button>
                </h3>
                <div className="flex flex-wrap gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedMetric('popularity')}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                      selectedMetric === 'popularity'
                        ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    Popularity
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedMetric('duration')}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                      selectedMetric === 'duration'
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    Duration
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedMetric('release')}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                      selectedMetric === 'release'
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    Release Year
                  </motion.button>
                </div>
              </div>

              {/* Chart Container with Enhanced Visualizations */}
              <div className="h-80 relative">
                <AnimatePresence mode="wait">
                  {selectedMetric === 'popularity' && (
                    <motion.div
                      key="popularity"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="h-full"
                    >
                      <Doughnut 
                        options={{
                          ...chartOptions,
                          plugins: {
                            ...chartOptions.plugins,
                            title: {
                              display: true,
                              text: 'Track Popularity Distribution',
                              color: 'rgb(107, 114, 128)',
                              font: {
                                size: 16,
                                weight: 'bold'
                              }
                            }
                          }
                        }} 
                        data={preparePopularityData(stats)} 
                      />
                    </motion.div>
                  )}
                  {selectedMetric === 'duration' && (
                    <motion.div
                      key="duration"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="h-full"
                    >
                      <Pie 
                        options={{
                          ...chartOptions,
                          plugins: {
                            ...chartOptions.plugins,
                            title: {
                              display: true,
                              text: 'Track Duration Distribution',
                              color: 'rgb(107, 114, 128)',
                              font: {
                                size: 16,
                                weight: 'bold'
                              }
                            }
                          }
                        }}
                        data={prepareDurationData(stats)} 
                      />
                    </motion.div>
                  )}
                  {selectedMetric === 'release' && (
                    <motion.div
                      key="release"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="h-full flex flex-col"
                    >
                      <div className="flex-1">
                        <Line 
                          options={{
                            ...chartOptions,
                            plugins: {
                              ...chartOptions.plugins,
                              title: {
                                display: true,
                                text: 'Tracks by Release Year',
                                color: 'rgb(107, 114, 128)',
                                font: {
                                  size: 16,
                                  weight: 'bold'
                                }
                              }
                            }
                          }}
                          data={prepareYearData(stats)} 
                        />
                      </div>
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Decade Distribution</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {Object.entries(stats.decadeDistribution || {})
                            .sort(([a], [b]) => b.localeCompare(a))
                            .map(([decade, count]) => {
                              const percentage = ((count / stats.totalTracks) * 100).toFixed(1);
                              return (
                                <div key={decade} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">{decade}s</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">{count} tracks ({percentage}%)</div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}

        {activeView === 'genres' && (
          <motion.div
            key="genres"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <GlassmorphicContainer className="bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-800/80 dark:to-gray-900/40 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <PieChart className="text-purple-500" size={20} />
                Genre Distribution
              </h3>
              <div className="space-y-4">
                {stats.genres.map((genre, index) => {
                  const percentage = Math.round((genre.count / (stats.totalGenreMentions || stats.totalTracks)) * 100);
                  return (
                    <GlassmorphicContainer className="group" rounded="xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full shadow-sm"
                            style={{ backgroundColor: genre.color }}
                          />
                          <span className="font-medium text-gray-900 dark:text-white">{genre.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">{genre.count} tracks</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{percentage}%</span>
                        </div>
                      </div>
                      <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: genre.color }}
                        />
                      </div>
                    </GlassmorphicContainer>
                  );
                })}
              </div>
            </GlassmorphicContainer>
          </motion.div>
        )}

        {activeView === 'artists' && (
          <motion.div
            key="artists"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <GlassmorphicContainer className="p-6" rounded="xl">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Users className="text-purple-500" size={20} />
                Top Artists
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats.topArtists.map((artist, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative"
                  >
                    <div className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 shadow-xl">
                        {artist.image ? (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 animate-pulse" />
                            <img 
                              src={artist.image} 
                              alt={artist.name}
                              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300 relative z-10"
                              loading="lazy"
                              onLoad={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (target.previousElementSibling) {
                                  target.previousElementSibling.remove(); // Remove loading animation
                                }
                              }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                if (target.previousElementSibling) {
                                  target.previousElementSibling.remove(); // Remove loading animation
                                }
                                if (target.parentElement) {
                                  target.parentElement.classList.add('bg-gradient-to-br', 'from-purple-500/10', 'to-pink-500/10');
                                  const fallback = document.createElement('div');
                                  fallback.className = 'w-full h-full flex items-center justify-center';
                                  fallback.innerHTML = `<span class="text-2xl font-bold text-purple-500/70">${artist.name.charAt(0).toUpperCase()}</span>`;
                                  target.parentElement.appendChild(fallback);
                                }
                              }}
                            />
                          </>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center">
                            <span className="text-2xl font-bold text-purple-500/70">{artist.name.charAt(0).toUpperCase()}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="flex-1 min-w-0 ml-4">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white truncate group-hover:text-purple-500 transition-colors">
                          {artist.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1">
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(artist.count / stats.totalTracks) * 100}%` }}
                                transition={{ duration: 1, delay: i * 0.1 }}
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                              />
                            </div>
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                            {artist.count} {artist.count === 1 ? 'track' : 'tracks'}
                          </span>
                        </div>
                        {artist.popularity !== undefined && (
                          <div className="mt-2 flex items-center gap-2">
                            <Flame size={14} className="text-orange-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Popularity: {artist.popularity}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassmorphicContainer>
          </motion.div>
        )}

        {activeView === 'insights' && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <GlassmorphicContainer className="bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-800/80 dark:to-gray-900/40 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Zap className="text-yellow-500" size={20} />
                Smart Insights
              </h3>
              <div className="space-y-6">
                {/* Personalized insights based on data */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <GlassmorphicContainer className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="text-red-500" size={16} />
                      <span className="font-medium text-gray-900 dark:text-white">Music Taste</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your playlist shows a strong preference for {stats.genres[0]?.name || 'diverse'} music with 
                      {stats.avgPopularity > 70 ? ' highly popular' : stats.avgPopularity > 40 ? ' moderately popular' : ' underground'} tracks.
                    </p>
                  </GlassmorphicContainer>
                  
                  <GlassmorphicContainer className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Volume2 className="text-blue-500" size={16} />
                      <span className="font-medium text-gray-900 dark:text-white">Listening Habits</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      With {Math.round(stats.totalDuration / 60)} hours of music, you have about {Math.round(stats.totalDuration / 60)} hours of listening time.
                    </p>
                  </GlassmorphicContainer>
                </div>

                {/* Recommendations */}
                <GlassmorphicContainer className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="text-green-500" size={16} />
                    <span className="font-medium text-gray-900 dark:text-white">Recommendations</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    {advancedMetrics.diversityScore < 30 && (
                      <div className="flex items-center gap-2">
                        <Shuffle size={14} />
                        <span>Try exploring more genres to diversify your playlist</span>
                      </div>
                    )}
                    {stats.avgPopularity < 40 && (
                      <div className="flex items-center gap-2">
                        <TrendingUp size={14} />
                        <span>You enjoy discovering underground music - consider checking out similar artists</span>
                      </div>
                    )}
                    {advancedMetrics.vintageScore > 50 && (
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        <span>You have great taste in classic music - explore more from those eras</span>
                      </div>
                    )}
                  </div>
                </GlassmorphicContainer>
              </div>
            </GlassmorphicContainer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer with brand logo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center"
      >
        <SoundSwappLogo size={24} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Powered by SoundSwapp Analytics
        </p>
      </motion.div>
    </GlassmorphicContainer>
  );
}

// Add alias export for backward compatibility
export const PlaylistInsights = EnhancedPlaylistInsights;

// Add these styles to your CSS
const brandStyles = `
  :root {
    --brand-primary: #8B5CF6;
    --brand-accent-pink: #EC4899;
    --brand-secondary: #06B6D4;
    --brand-primary-rgb: 139, 92, 246;
    --brand-accent-pink-rgb: 236, 72, 153;
    --brand-secondary-rgb: 6, 182, 212;
  }

  @keyframes pulse-slow {
    0%, 100% { opacity: 0.8; transform: scale(0.98); }
    50% { opacity: 1; transform: scale(1.02); }
  }

  .animate-pulse-slow {
    animation: pulse-slow 3s ease-in-out infinite;
  }

  .ss-letter-main {
    animation: pulseSSMain 2.8s ease-in-out infinite;
    transform-origin: center;
  }

  .ss-letter-highlight {
    animation: pulseSSHighlight 2.8s ease-in-out infinite;
    transform-origin: center;
    opacity: 0.7;
  }

  @keyframes pulseSSMain {
    0%, 100% { 
      opacity: 0.9;
      transform: scale(0.98);
      stroke-dasharray: 1000;
      stroke-dashoffset: 1000;
    }
    40% {
      stroke-dashoffset: 0;
      opacity: 1;
    }
    50% { 
      opacity: 1;
      transform: scale(1.02);
    }
    90%, 100% {
      stroke-dashoffset: -1000;
      opacity: 0.9;
    }
  }

  @keyframes pulseSSHighlight {
    0%, 100% { 
      opacity: 0.5;
      transform: scale(0.96);
      stroke-dasharray: 1000;
      stroke-dashoffset: 1000;
    }
    40% {
      stroke-dashoffset: 0;
      opacity: 0.7;
    }
    50% { 
      opacity: 0.7;
      transform: scale(1);
    }
    90%, 100% {
      stroke-dashoffset: -1000;
      opacity: 0.5;
    }
  }
`;
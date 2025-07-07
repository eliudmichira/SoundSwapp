import { ComponentType } from 'react';
import { LucideIcon } from 'lucide-react';
import { ColorKey } from '../utils/colors';

export namespace PlaylistTypes {
  export interface Track {
    name: string;
    artists: string[];
    popularity?: number;
    duration_ms?: number;
    explicit?: boolean;
    album?: string;
    releaseYear?: string | number;
    genres?: string[];
    artistImages?: string[];
    id?: string;
    searchQuery?: string;
  }

  export interface Genre {
    name: string;
    count: number;
    color: string;
    percentage?: number;
  }

  export interface Artist {
    name: string;
    count: number;
    image?: string;
    popularity?: number;
  }

  export interface Album {
    name: string;
    trackCount: number;
    year?: number;
  }

  export interface PlaylistStats {
    totalTracks: number;
    avgPopularity: number;
    totalDuration: number;
    genres: Genre[];
    topArtists: Artist[];
    releaseYears: Record<string, number>;
    totalGenreMentions?: number;
    mostPopularTrack?: Track;
    leastPopularTrack?: Track;
    longestTrack?: Track;
    shortestTrack?: Track;
    explicitCount?: number;
    nonExplicitCount?: number;
    topAlbums?: Album[];
    avgTrackLength?: number;
    oldestTrack?: Track;
    newestTrack?: Track;
    popularityDistribution?: { range: string; count: number }[];
    durationDistribution?: { range: string; count: number }[];
    explicitPercentage?: number;
    uniqueArtists?: number;
    uniqueAlbums?: number;
    decadeDistribution?: Record<string, number>;
    genrePercentages?: Record<string, number>;
    yearlyTrends?: {
      year: string;
      count: number;
      avgPopularity: number;
    }[];
    durationCategories?: {
      short: number;
      medium: number;
      long: number;
    };
    popularityRanges?: {
      low: number;
      medium: number;
      high: number;
    };
  }

  export interface PlaylistInsightsProps {
    stats: PlaylistStats;
    onShare?: () => void;
    onExport?: () => void;
  }

  export interface InsightCardProps {
    icon: LucideIcon;
    title: string;
    value: string | number;
    subtitle: string;
    color?: ColorKey;
    trend?: string;
    onClick?: () => void;
    gradient?: boolean;
  }

  export interface ProgressBarProps {
    label: string;
    value: number;
    max: number;
    color?: ColorKey;
  }

  export interface CircularProgressProps {
    percentage: number;
    color?: ColorKey;
    size?: number;
    strokeWidth?: number;
  }
} 
import { searchYouTube } from './youtubeApi';
import Fuse from 'fuse.js';
import LRUCache from 'lru-cache';
import pLimit from 'p-limit';

// Enhanced type definitions
interface SpotifyTrack {
  id: string;
  name: string;
  artists: string[];
  album: string;
  duration_ms: number;
  popularity: number;
  explicit: boolean;
  searchQuery: string;
  isrc?: string; // International Standard Recording Code
  genres?: string[];
  releaseDate?: string;
}

interface FuseSearchItem {
  title: string;
  artist: string;
}

interface YouTubeMatch {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  score: number;
  matchDetails: {
    titleMatch: number;
    artistMatch: number;
    lengthScore: number;
    metadataScore: number;
    popularityScore: number;
    verifiedChannel: boolean;
  };
  isMockData?: boolean;
  confidence: 'high' | 'medium' | 'low';
  alternativeMatches?: YouTubeMatch[];
}

interface CacheEntry {
  match: YouTubeMatch | null;
  timestamp: number;
  searchQuery: string;
}

// Configuration
const CONFIG = {
  CACHE_TTL: 24 * 60 * 60 * 1000, // 24 hours
  CACHE_MAX_SIZE: 10000,
  BATCH_SIZE: 10,
  RATE_LIMIT_DELAY: 100, // ms between API calls
  MIN_MATCH_SCORE: 0.6,
  CONCURRENT_REQUESTS: 5,
  SEARCH_VARIATIONS: 3,
  FUZZY_MATCH_THRESHOLD: 0.7
};

// Initialize cache with LRU eviction
const matchCache = new LRUCache<string, CacheEntry>({
  max: CONFIG.CACHE_MAX_SIZE,
  ttl: CONFIG.CACHE_TTL,
  updateAgeOnGet: true
});

// Rate limiter for API calls
const limiter = pLimit(CONFIG.CONCURRENT_REQUESTS);

// Pre-compiled regex patterns for better performance
const PATTERNS = {
  CLEAN_TITLE: /[\(\[\{].*?[\)\]\}]/g, // Remove brackets and their contents
  FEATURING: /\s+(feat\.|featuring|ft\.|with)\s+/gi,
  OFFICIAL: /\b(official|video|audio|lyric|lyrics|visualizer|hd|hq|4k)\b/gi,
  REMIX: /\b(remix|mix|version|edit|acoustic|live|cover)\b/gi,
  YEAR: /\b(19|20)\d{2}\b/g,
  EXTRA_SPACES: /\s+/g,
  NON_ALPHANUMERIC: /[^\w\s]/g
};

// Fuzzy string matcher for improved accuracy
const fuzzyMatcher = new Fuse<FuseSearchItem>([], {
  keys: ['title', 'artist'],
  threshold: CONFIG.FUZZY_MATCH_THRESHOLD,
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: 3
});

/**
 * Enhanced track matching with multiple strategies
 */
export class EnhancedTrackMatcher {
  private readonly userId: string;
  private readonly searchCache = new Map<string, any>();
  
  constructor(userId: string) {
    this.userId = userId;
  }

  /**
   * Find the best match using multiple search strategies
   */
  async findBestMatch(track: SpotifyTrack): Promise<YouTubeMatch | null> {
    // Check cache first
    const cacheKey = this.generateCacheKey(track);
    const cached = matchCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CONFIG.CACHE_TTL) {
      console.log(`Cache hit for track: ${track.name}`);
      return cached.match;
    }

    try {
      // Generate multiple search queries for better coverage
      const searchQueries = this.generateSearchQueries(track);
      
      // Search with all queries in parallel (with rate limiting)
      const allResults = await Promise.all(
        searchQueries.map(query => 
          limiter(() => this.searchWithRetry(query))
        )
      );

      // Flatten and deduplicate results
      const uniqueResults = this.deduplicateResults(allResults.flat());
      
      // Score all results
      const scoredMatches = await this.scoreMatches(uniqueResults, track);
      
      // Sort by score and confidence
      scoredMatches.sort((a, b) => {
        if (a.confidence !== b.confidence) {
          const confidenceOrder = { high: 3, medium: 2, low: 1 };
          return confidenceOrder[b.confidence] - confidenceOrder[a.confidence];
        }
        return b.score - a.score;
      });

      // Get best match and alternatives
      const bestMatch = scoredMatches[0];
      
      if (bestMatch && bestMatch.score >= CONFIG.MIN_MATCH_SCORE) {
        // Add alternative matches for user selection
        bestMatch.alternativeMatches = scoredMatches.slice(1, 4);
        
        // Cache the result
        matchCache.set(cacheKey, {
          match: bestMatch,
          timestamp: Date.now(),
          searchQuery: searchQueries[0]
        });
        
        return bestMatch;
      }

      // Cache null result to avoid repeated failed searches
      matchCache.set(cacheKey, {
        match: null,
        timestamp: Date.now(),
        searchQuery: searchQueries[0]
      });

      return null;
    } catch (error) {
      console.error('Error in findBestMatch:', error);
      
      // Return cached result if available, even if expired
      if (cached) {
        console.log('Returning expired cache due to error');
        return cached.match;
      }
      
      throw error;
    }
  }

  /**
   * Generate multiple search queries for better coverage
   */
  private generateSearchQueries(track: SpotifyTrack): string[] {
    const queries: string[] = [];
    
    // Original query
    queries.push(track.searchQuery);
    
    // Clean title + main artist
    const cleanTitle = this.cleanString(track.name);
    const mainArtist = track.artists[0];
    queries.push(`${cleanTitle} ${mainArtist}`);
    
    // Title + all artists
    if (track.artists.length > 1) {
      queries.push(`${cleanTitle} ${track.artists.join(' ')}`);
    }
    
    // With album name (for disambiguation)
    queries.push(`${cleanTitle} ${mainArtist} ${track.album}`);
    
    // Remove duplicates and limit
    return [...new Set(queries)].slice(0, CONFIG.SEARCH_VARIATIONS);
  }

  /**
   * Search with exponential backoff retry
   */
  private async searchWithRetry(query: string, retries = 3): Promise<any[]> {
    // Check search cache
    if (this.searchCache.has(query)) {
      return this.searchCache.get(query);
    }

    for (let i = 0; i < retries; i++) {
      try {
        await this.rateLimitDelay();
        const results = await searchYouTube(this.userId, query);
        
        if (results.items && results.items.length > 0) {
          this.searchCache.set(query, results.items);
          return results.items;
        }
        
        return [];
      } catch (error) {
        if (i === retries - 1) throw error;
        
        // Exponential backoff
        await new Promise(resolve => 
          setTimeout(resolve, Math.pow(2, i) * 1000)
        );
      }
    }
    
    return [];
  }

  /**
   * Advanced scoring algorithm
   */
  private async scoreMatches(
    results: any[], 
    track: SpotifyTrack
  ): Promise<YouTubeMatch[]> {
    const scoredMatches: YouTubeMatch[] = [];
    
    for (const result of results) {
      const match = await this.calculateMatchScore(result, track);
      if (match.score >= CONFIG.MIN_MATCH_SCORE) {
        scoredMatches.push(match);
      }
    }
    
    return scoredMatches;
  }

  /**
   * Calculate comprehensive match score
   */
  private async calculateMatchScore(
    result: any, 
    track: SpotifyTrack
  ): Promise<YouTubeMatch> {
    const videoId = result.id?.videoId || result.id;
    const title = result.snippet.title;
    const channelTitle = result.snippet.channelTitle;
    const description = result.snippet.description || '';
    const thumbnailUrl = result.snippet.thumbnails.high?.url || 
                        result.snippet.thumbnails.medium?.url ||
                        result.snippet.thumbnails.default?.url;

    // Enhanced scoring components
    const titleMatch = this.calculateEnhancedTitleMatch(title, track);
    const artistMatch = this.calculateEnhancedArtistMatch(
      channelTitle, 
      description, 
      track
    );
    const lengthScore = await this.calculateLengthScore(result, track);
    const metadataScore = this.calculateMetadataScore(
      title, 
      description, 
      track
    );
    const popularityScore = this.calculatePopularityScore(result, track);
    const verifiedChannel = this.isVerifiedChannel(channelTitle, description);

    // Weighted scoring with dynamic weights
    const weights = this.calculateDynamicWeights(track);
    const score = 
      (titleMatch * weights.title) +
      (artistMatch * weights.artist) +
      (lengthScore * weights.length) +
      (metadataScore * weights.metadata) +
      (popularityScore * weights.popularity) +
      (verifiedChannel ? 0.1 : 0);

    // Determine confidence level
    const confidence = this.calculateConfidence(score, {
      titleMatch,
      artistMatch,
      lengthScore,
      verifiedChannel
    });

    return {
      videoId,
      title,
      channelTitle,
      thumbnailUrl,
      score: Math.min(score, 1), // Cap at 1
      matchDetails: {
        titleMatch,
        artistMatch,
        lengthScore,
        metadataScore,
        popularityScore,
        verifiedChannel
      },
      confidence
    };
  }

  /**
   * Enhanced title matching with fuzzy logic
   */
  private calculateEnhancedTitleMatch(
    youtubeTitle: string, 
    track: SpotifyTrack
  ): number {
    // Clean and normalize strings
    const ytClean = this.cleanString(youtubeTitle);
    const trackClean = this.cleanString(track.name);
    
    // Exact match
    if (ytClean === trackClean) return 1.0;
    
    // Contains match
    if (ytClean.includes(trackClean) || trackClean.includes(ytClean)) {
      return 0.9;
    }
    
    // Fuzzy matching
    fuzzyMatcher.setCollection([{ title: ytClean, artist: '' }]);
    const fuzzyResult = fuzzyMatcher.search(trackClean);
    
    if (fuzzyResult.length > 0 && fuzzyResult[0].score !== undefined) {
      return 1 - fuzzyResult[0].score; // Fuse returns 0 for perfect match
    }
    
    // Token-based matching
    const ytTokens = this.tokenize(ytClean);
    const trackTokens = this.tokenize(trackClean);
    
    const intersection = ytTokens.filter(t => trackTokens.includes(t));
    const union = new Set([...ytTokens, ...trackTokens]);
    
    return intersection.length / union.size; // Jaccard similarity
  }

  /**
   * Enhanced artist matching with channel verification
   */
  private calculateEnhancedArtistMatch(
    channelTitle: string, 
    description: string, 
    track: SpotifyTrack
  ): number {
    let maxScore = 0;
    
    for (const artist of track.artists) {
      const artistClean = this.cleanString(artist);
      const channelClean = this.cleanString(channelTitle);
      
      // Direct channel match
      if (channelClean === artistClean) {
        maxScore = Math.max(maxScore, 1.0);
        continue;
      }
      
      // Channel contains artist
      if (channelClean.includes(artistClean)) {
        maxScore = Math.max(maxScore, 0.9);
        continue;
      }
      
      // Check description for artist mention
      if (description.toLowerCase().includes(artist.toLowerCase())) {
        maxScore = Math.max(maxScore, 0.7);
        continue;
      }
      
      // Fuzzy match
      fuzzyMatcher.setCollection([{ title: '', artist: channelClean }]);
      const fuzzyResult = fuzzyMatcher.search(artistClean);
      
      if (fuzzyResult.length > 0 && fuzzyResult[0].score !== undefined) {
        maxScore = Math.max(maxScore, 1 - fuzzyResult[0].score);
      }
    }
    
    // Boost for official/VEVO channels
    if (this.isOfficialChannel(channelTitle)) {
      maxScore = Math.max(maxScore, 0.6);
    }
    
    return maxScore;
  }

  /**
   * Calculate video length match score
   */
  private async calculateLengthScore(
    result: any, 
    track: SpotifyTrack
  ): Promise<number> {
    // In production, fetch video details for duration
    // For now, we'll use a heuristic based on title
    
    const title = result.snippet.title.toLowerCase();
    const trackLengthSec = track.duration_ms / 1000;
    
    // Check for extended/short versions
    if (title.includes('extended') || title.includes('full version')) {
      return trackLengthSec > 300 ? 0.8 : 0.5; // Favor if track is long
    }
    
    if (title.includes('short') || title.includes('radio edit')) {
      return trackLengthSec < 240 ? 0.8 : 0.5; // Favor if track is short
    }
    
    // Default to good score if no indicators
    return 0.85;
  }

  /**
   * Score based on metadata matches
   */
  private calculateMetadataScore(
    title: string, 
    description: string, 
    track: SpotifyTrack
  ): number {
    let score = 0;
    const combined = `${title} ${description}`.toLowerCase();
    
    // Album match
    if (track.album && combined.includes(track.album.toLowerCase())) {
      score += 0.3;
    }
    
    // Year match
    if (track.releaseDate) {
      const year = track.releaseDate.substring(0, 4);
      if (combined.includes(year)) {
        score += 0.2;
      }
    }
    
    // Genre indicators
    if (track.genres) {
      const genreMatches = track.genres.filter(genre => 
        combined.includes(genre.toLowerCase())
      );
      score += Math.min(0.2, genreMatches.length * 0.1);
    }
    
    // Quality indicators
    const qualityTerms = ['official', 'hd', 'hq', 'high quality', 'remastered'];
    const hasQuality = qualityTerms.some(term => combined.includes(term));
    if (hasQuality) {
      score += 0.2;
    }
    
    // Negative indicators
    const negativeTerms = ['cover', 'tribute', 'karaoke', 'instrumental', 'reaction'];
    const hasNegative = negativeTerms.some(term => combined.includes(term));
    if (hasNegative && !track.name.toLowerCase().includes('instrumental')) {
      score -= 0.3;
    }
    
    return Math.max(0, Math.min(1, score));
  }

  /**
   * Calculate popularity alignment score
   */
  private calculatePopularityScore(result: any, track: SpotifyTrack): number {
    // YouTube doesn't directly provide view count in search results
    // Use position in search results as proxy
    const position = result._searchPosition || 0;
    const spotifyPopularity = track.popularity / 100; // Normalize to 0-1
    
    // Assume top results are more popular
    const estimatedYoutubePopularity = Math.max(0, 1 - (position / 10));
    
    // Calculate similarity in popularity
    const difference = Math.abs(spotifyPopularity - estimatedYoutubePopularity);
    return 1 - difference;
  }

  /**
   * Calculate dynamic weights based on track characteristics
   */
  private calculateDynamicWeights(track: SpotifyTrack) {
    const weights = {
      title: 0.35,
      artist: 0.25,
      length: 0.15,
      metadata: 0.15,
      popularity: 0.10
    };
    
    // Adjust weights based on track characteristics
    if (track.artists.length > 2) {
      // Multiple artists make artist matching more important
      weights.artist = 0.30;
      weights.title = 0.30;
    }
    
    if (track.name.length > 30 || track.name.includes('(')) {
      // Complex titles need better title matching
      weights.title = 0.40;
      weights.metadata = 0.10;
    }
    
    if (track.popularity < 30) {
      // Less popular tracks need metadata help
      weights.metadata = 0.25;
      weights.popularity = 0.05;
    }
    
    return weights;
  }

  /**
   * Determine match confidence level
   */
  private calculateConfidence(
    score: number, 
    components: any
  ): 'high' | 'medium' | 'low' {
    if (score >= 0.85 && components.verifiedChannel) {
      return 'high';
    }
    
    if (score >= 0.75 && components.titleMatch >= 0.8 && components.artistMatch >= 0.7) {
      return 'high';
    }
    
    if (score >= 0.65) {
      return 'medium';
    }
    
    return 'low';
  }

  /**
   * Utility methods
   */
  private cleanString(str: string): string {
    return str
      .toLowerCase()
      .replace(PATTERNS.CLEAN_TITLE, '') // Remove bracketed content
      .replace(PATTERNS.FEATURING, ' ') // Normalize featuring
      .replace(PATTERNS.OFFICIAL, '') // Remove video type indicators
      .replace(PATTERNS.YEAR, '') // Remove years
      .replace(PATTERNS.NON_ALPHANUMERIC, ' ') // Remove special chars
      .replace(PATTERNS.EXTRA_SPACES, ' ') // Normalize spaces
      .trim();
  }

  private tokenize(str: string): string[] {
    return str.split(' ').filter(token => token.length > 2);
  }

  private isOfficialChannel(channel: string): boolean {
    const official = ['official', 'vevo', 'records', 'music'];
    return official.some(term => channel.toLowerCase().includes(term));
  }

  private isVerifiedChannel(channel: string, description: string): boolean {
    // In production, check YouTube API for verification badge
    // For now, use heuristics
    return this.isOfficialChannel(channel) || 
           description.includes('Official Artist Channel');
  }

  private generateCacheKey(track: SpotifyTrack): string {
    // Use ISRC if available for better caching
    if (track.isrc) {
      return `isrc:${track.isrc}`;
    }
    return `${track.id}:${track.name}:${track.artists[0]}`;
  }

  private deduplicateResults(results: any[]): any[] {
    const seen = new Set<string>();
    return results.filter(result => {
      const id = result.id?.videoId || result.id;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }

  private async rateLimitDelay(): Promise<void> {
    await new Promise(resolve => 
      setTimeout(resolve, CONFIG.RATE_LIMIT_DELAY)
    );
  }
}

/**
 * Enhanced batch matching with progress tracking
 */
export class BatchMatcher {
  private matcher: EnhancedTrackMatcher;
  
  constructor(userId: string) {
    this.matcher = new EnhancedTrackMatcher(userId);
  }

  /**
   * Match tracks with progress callback
   */
  async matchTracks(
    tracks: SpotifyTrack[],
    onProgress?: (progress: number, track: SpotifyTrack) => void
  ): Promise<Map<string, YouTubeMatch | null>> {
    const results = new Map<string, YouTubeMatch | null>();
    const total = tracks.length;
    
    // Group by ISRC for deduplication
    const trackGroups = this.groupTracksByISRC(tracks);
    
    // Process in parallel batches
    const batchSize = CONFIG.BATCH_SIZE;
    const batches: SpotifyTrack[][] = [];
    
    for (let i = 0; i < tracks.length; i += batchSize) {
      batches.push(tracks.slice(i, i + batchSize));
    }
    
    let processed = 0;
    
    for (const batch of batches) {
      const batchPromises = batch.map(async track => {
        try {
          // Check if we already matched this ISRC
          if (track.isrc && trackGroups.has(track.isrc)) {
            const existing = trackGroups.get(track.isrc)!;
            if (existing.id !== track.id && results.has(existing.id)) {
              results.set(track.id, results.get(existing.id)!);
              return;
            }
          }
          
          const match = await this.matcher.findBestMatch(track);
          results.set(track.id, match);
          
          processed++;
          if (onProgress) {
            onProgress(processed / total, track);
          }
        } catch (error) {
          console.error(`Error matching track ${track.name}:`, error);
          results.set(track.id, null);
        }
      });
      
      await Promise.all(batchPromises);
    }
    
    return results;
  }

  /**
   * Group tracks by ISRC to avoid duplicate searches
   */
  private groupTracksByISRC(tracks: SpotifyTrack[]): Map<string, SpotifyTrack> {
    const groups = new Map<string, SpotifyTrack>();
    
    for (const track of tracks) {
      if (track.isrc && !groups.has(track.isrc)) {
        groups.set(track.isrc, track);
      }
    }
    
    return groups;
  }
}

// Export convenience functions
export const findBestMatch = async (
  userId: string, 
  track: SpotifyTrack
): Promise<YouTubeMatch | null> => {
  const matcher = new EnhancedTrackMatcher(userId);
  return matcher.findBestMatch(track);
};

export const batchFindMatches = async (
  userId: string, 
  tracks: SpotifyTrack[],
  onProgress?: (progress: number, track: SpotifyTrack) => void
): Promise<Map<string, YouTubeMatch | null>> => {
  const batchMatcher = new BatchMatcher(userId);
  return batchMatcher.matchTracks(tracks, onProgress);
};
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { useConversion } from '../lib/ConversionContext';
import { PlaylistInsights } from './visualization/PlaylistInsights';
import { GlassmorphicContainer } from './ui/GlassmorphicContainer';
import { motion } from 'framer-motion';
import { doc, getDoc, type Firestore } from 'firebase/firestore';
import { db, waitForFirestore, initializeFirebase, handleFirestoreError } from '../lib/firebase';
import { ChevronLeft } from 'lucide-react';
import { generatePlaylistInsights } from './EnhancedPlaylistConverter';
import type { PlaylistTypes } from '../types/playlist';
import { SpotifyService } from '../lib/spotifyApi';

// Type assertion for Firestore db
const firestore = db as Firestore;

interface ConversionData {
  id: string;
  spotifyPlaylistId: string;
  spotifyPlaylistName: string;
  tracks: PlaylistTypes.Track[];
  convertedAt: Date;
}

const convertTrackData = (track: any): PlaylistTypes.Track => {
  // Validate track object exists
  if (!track) {
    console.warn('Debug - Received null or undefined track');
    return {
      name: 'Unknown Track',
      artists: ['Unknown Artist'],
      popularity: 0,
      duration_ms: 0,
      explicit: false,
      album: 'Unknown Album',
      releaseYear: undefined,
      genres: [],
      artistImages: []
    };
  }

  // Log track data before conversion
  console.log('Debug - Converting track data:', track);

  // Convert and validate each field with detailed logging
  const convertedTrack = {
    name: typeof track.name === 'string' ? track.name : 'Unknown Track',
    artists: Array.isArray(track.artists) ? track.artists.filter(Boolean) : [typeof track.artists === 'string' ? track.artists : 'Unknown Artist'],
    popularity: typeof track.popularity === 'number' && !isNaN(track.popularity) ? track.popularity : 0,
    duration_ms: typeof track.duration_ms === 'number' && !isNaN(track.duration_ms) ? track.duration_ms : 0,
    explicit: typeof track.explicit === 'boolean' ? track.explicit : false,
    album: typeof track.album === 'string' ? track.album : 'Unknown Album',
    releaseYear: track.releaseYear ? Number(track.releaseYear) : undefined,
    genres: Array.isArray(track.genres) ? track.genres.filter(Boolean) : [],
    artistImages: Array.isArray(track.artistImages) ? track.artistImages.filter(Boolean) : []
  };

  // Log converted track data
  console.log('Debug - Converted track data:', convertedTrack);

  return convertedTrack;
};

export const ConversionInsights: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { state: conversionState, dispatch } = useConversion();
  const [conversionData, setConversionData] = useState<ConversionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConversion = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Initialize Firebase with retry logic
        const db = await initializeFirebase();
        if (!db) throw new Error('Failed to initialize Firebase');
        
        // Get conversion data
        const conversionRef = doc(db, 'conversions', id);
        const conversionDoc = await getDoc(conversionRef);
        
        if (!conversionDoc.exists()) {
          throw new Error('Conversion not found');
        }
        
        const data = conversionDoc.data();
        // Update conversion state using dispatch
        dispatch({ type: 'SET_TRACKS', payload: data.tracks || [] });
        
        // Load playlist data if available
        if (data.playlistId) {
          try {
            const playlistData = await SpotifyService.getPlaylistById(data.playlistId);
            setConversionData({
              id: data.id,
              spotifyPlaylistId: data.spotifyPlaylistId,
              spotifyPlaylistName: data.spotifyPlaylistName,
              tracks: data.tracks.map(convertTrackData),
              convertedAt: new Date(data.convertedAt)
            });
          } catch (err: any) {
            if (err.status === 404) {
              setError('Playlist not found. It may have been deleted or made private.');
            } else {
              setError('Failed to load playlist data: ' + err.message);
            }
          }
        }
      } catch (err: any) {
        const errorMessage = handleFirestoreError(err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadConversion();
  }, [id, dispatch]);

  // Add debug logging for conversion data and stats
  useEffect(() => {
    if (conversionData) {
      console.log('Debug - Processed conversion data:', {
        name: conversionData.spotifyPlaylistName,
        trackCount: conversionData.tracks.length,
        sampleTrack: conversionData.tracks[0]
      });
    }
  }, [conversionData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (error || !conversionData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">{error || 'No data available'}</h2>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-900 dark:text-white bg-gray-200 hover:bg-gray-300 dark:bg-brand-primary dark:hover:bg-brand-primaryHover border border-gray-300 dark:border-transparent rounded-md shadow-sm transition-colors"
          >
            <ChevronLeft size={16} />
            Back to Converter
          </button>
        </div>
      </div>
    );
  }

  // Add debug logging
  console.log('Conversion data:', {
    name: conversionData.spotifyPlaylistName,
    trackCount: conversionData.tracks.length,
    sampleTrack: conversionData.tracks[0]
  });

  const playlistStats = generatePlaylistInsights(conversionData.tracks);
  
  // Add debug logging
  console.log('Generated playlist stats:', playlistStats);

  return (
    <div className="min-h-screen bg-background-primary py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-content-primary mb-2">
              {conversionData.spotifyPlaylistName}
            </h1>
            <p className="text-sm text-content-secondary">
              Converted on {conversionData.convertedAt.toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-900 dark:text-white bg-gray-200 hover:bg-gray-300 dark:bg-brand-primary dark:hover:bg-brand-primaryHover border border-gray-300 dark:border-transparent rounded-md shadow-sm transition-colors"
          >
            <ChevronLeft size={16} />
            Back to Converter
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GlassmorphicContainer
            className="p-4 sm:p-6"
            shadow="xl"
            animate={true}
            hoverEffect={true}
          >
            <PlaylistInsights
              stats={playlistStats}
            />
          </GlassmorphicContainer>
        </motion.div>
      </div>
    </div>
  );
}; 
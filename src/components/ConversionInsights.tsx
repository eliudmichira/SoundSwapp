import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { useConversion } from '../lib/ConversionContext';
import { PlaylistInsights, MobilePlaylistInsights } from './visualization/PlaylistInsights';
import { GlassmorphicContainer } from './ui/GlassmorphicContainer';
import { motion } from 'framer-motion';
import { doc, getDoc, type Firestore } from 'firebase/firestore';
import { db, waitForFirestore, handleFirestoreError, saveUserInsights, getUserInsights } from '../lib/firebase';
import { ChevronLeft } from 'lucide-react';
import { generatePlaylistInsights } from '../lib/playlistInsights';
import type { PlaylistTypes } from '../types/playlist';
import { SpotifyService } from '../lib/spotifyApi';
import { Preloader } from './ui/Preloader';
import useMobileDetection from '../hooks/useMobileDetection';

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
  const [playlistStats, setPlaylistStats] = useState<PlaylistTypes.PlaylistStats | null>(null);
  const { isMobile } = useMobileDetection();

  useEffect(() => {
    const loadConversion = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Try to initialize Firebase, but don't fail if it doesn't work
        let db = null;
        try {
          db = await waitForFirestore();
        } catch (firebaseError) {
          console.warn('Firebase initialization failed, continuing with local data:', firebaseError);
        }
        
        // First try to get conversion from local storage as fallback
        const localHistory = localStorage.getItem(`conversion_history_${user?.uid}`);
        let localConversion = null;
        
        if (localHistory) {
          try {
            const history = JSON.parse(localHistory);
            localConversion = history.find((conv: any) => conv.id === id);
          } catch (parseError) {
            console.warn('Failed to parse local history:', parseError);
          }
        }
        
        // Try to get conversion data from Firestore (only if Firebase is available)
        let conversionData = null;
        let firestoreError = null;
        
        if (user && db) {
          try {
            // Use correct path: users/{userId}/conversions/{conversionId}
            const conversionRef = doc(db, 'users', user.uid, 'conversions', id);
            const conversionDoc = await getDoc(conversionRef);
            
            if (conversionDoc.exists()) {
              conversionData = conversionDoc.data();
            }
          } catch (err) {
            console.warn('Firestore fetch failed, using local data:', err);
            firestoreError = err;
          }
        }
        
        // If Firestore failed, use local conversion data
        if (!conversionData && localConversion) {
          console.log('Using local conversion data as fallback');
          conversionData = localConversion;
        }
        
        // If still no data, try to get from conversion state
        if (!conversionData) {
          const stateConversion = conversionState.conversionHistory.find(conv => conv.id === id);
          if (stateConversion) {
            console.log('Using conversion state data');
            conversionData = stateConversion;
          }
        }
        
        if (!conversionData) {
          throw new Error('Conversion not found. It may have been deleted or you may not have permission to access it.');
        }
        
        // Process the conversion data
        const processedData = {
          id: conversionData.id,
          spotifyPlaylistId: conversionData.spotifyPlaylistId || conversionData.youtubePlaylistId,
          spotifyPlaylistName: conversionData.spotifyPlaylistName || conversionData.youtubePlaylistName || 'Unknown Playlist',
          tracks: (conversionData.tracks || []).map(convertTrackData),
          convertedAt: (() => {
            // Handle different date formats from Firestore and local storage
            const dateValue = conversionData.convertedAt;
            
            if (!dateValue) {
              return new Date(); // Fallback to current date
            }
            
            // If it's a Firestore Timestamp object
            if (dateValue && typeof dateValue === 'object' && dateValue.toDate) {
              return dateValue.toDate();
            }
            
            // If it's already a Date object
            if (dateValue instanceof Date) {
              return dateValue;
            }
            
            // If it's a timestamp number or string
            const parsedDate = new Date(dateValue);
            if (isNaN(parsedDate.getTime())) {
              console.warn('Invalid date value:', dateValue, 'using current date as fallback');
              return new Date();
            }
            
            return parsedDate;
          })()
        };
        
        setConversionData(processedData);
        
        // Update conversion state
        dispatch({ type: 'SET_TRACKS', payload: processedData.tracks });
        
      } catch (err: any) {
        console.error('Error loading conversion:', err);
        let errorMessage = 'Unable to load conversion data. Please try again.';
        
        if (err.message.includes('not found')) {
          errorMessage = 'Conversion not found. It may have been deleted or you may not have permission to access it.';
        } else if (err.message.includes('permission')) {
          errorMessage = 'You do not have permission to access this conversion.';
        } else if (err.message.includes('network') || err.message.includes('connection')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (err.message.includes('Firebase')) {
          errorMessage = 'Database connection issue. The app will work with local data only.';
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadConversion();
  }, [id, dispatch, user]);

  useEffect(() => {
    const loadOrSaveInsights = async () => {
      if (!user || !conversionData) return;
      try {
        // Try to load existing insights from Firebase
        let existing = null;
        try {
          existing = await getUserInsights(user.uid);
        } catch (firebaseError) {
          console.warn('Failed to load insights from Firebase, generating locally:', firebaseError);
        }
        
        if (existing && existing[conversionData.spotifyPlaylistId]) {
          setPlaylistStats(existing[conversionData.spotifyPlaylistId]);
        } else {
          // Generate and save new insights
          const stats = generatePlaylistInsights(conversionData.tracks);
          setPlaylistStats(stats);
          
          // Try to save insights, but don't fail if it doesn't work
          try {
            await saveUserInsights(user.uid, {
              ...(existing || {}),
              [conversionData.spotifyPlaylistId]: stats
            });
          } catch (saveError) {
            console.warn('Failed to save insights to Firebase, but continuing with local data:', saveError);
          }
        }
      } catch (err) {
        console.warn('Failed to load insights, generating locally:', err);
        // fallback: generate locally if error
        setPlaylistStats(generatePlaylistInsights(conversionData.tracks));
      }
    };
    if (conversionData) loadOrSaveInsights();
  }, [user, conversionData]);

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
      <Preloader
        showProgressText={true}
        theme="default"
        size="lg"
        initialDelay={0}
        onComplete={() => {
          // This will be called when preloader finishes, but we'll handle the actual loading in the useEffect
        }}
      />
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

  // Use playlistStats if available, else fallback
  const statsToShow = playlistStats || generatePlaylistInsights(conversionData.tracks);
  
  // Add debug logging
  console.log('Generated playlist stats:', statsToShow);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-content-primary mb-2">
              {conversionData.spotifyPlaylistName}
            </h1>
            <p className="text-sm text-content-secondary">
              Converted on {(() => {
                const date = conversionData.convertedAt;
                if (!date || isNaN(date.getTime())) {
                  return 'Recently';
                }
                return date.toLocaleDateString();
              })()}
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
          {isMobile ? (
            <MobilePlaylistInsights
              stats={statsToShow}
              tracks={conversionData.tracks}
            />
          ) : (
            <GlassmorphicContainer
              className="p-4 sm:p-6"
              shadow="xl"
              animate={true}
              hoverEffect={true}
            >
              <PlaylistInsights
                stats={statsToShow}
                tracks={conversionData.tracks}
              />
            </GlassmorphicContainer>
          )}
        </motion.div>
      </div>
    </div>
  );
}; 
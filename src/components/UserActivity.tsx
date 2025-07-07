import React, { useEffect, useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { getUserActivities, UserActivity } from '../lib/activityTracker';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Calendar, Music, Youtube, LogIn } from 'lucide-react';

const activityIcons = {
  'LOGIN': <LogIn className="w-5 h-5 text-blue-500" />,
  'SPOTIFY_CONNECT': <Music className="w-5 h-5 text-green-500" />,
  'YOUTUBE_CONNECT': <Youtube className="w-5 h-5 text-red-500" />,
  'PLAYLIST_CONVERT': <Activity className="w-5 h-5 text-purple-500" />,
  'PLAYLIST_SHARE': <Calendar className="w-5 h-5 text-orange-500" />
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
};

const ActivityItem: React.FC<{ activity: UserActivity }> = ({ activity }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
        {activityIcons[activity.type]}
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          {activity.type.split('_').join(' ')}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {formatDate(activity.timestamp)}
        </p>
      </div>
    </motion.div>
  );
};

export const UserActivityHistory: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const userActivities = await getUserActivities(user.uid);
        setActivities(userActivities);
      } catch (err) {
        setError('Failed to load activity history');
        console.error('Error fetching activities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [user]);

  if (!user) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Activity History</h2>
        {loading && (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 dark:border-white"></div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      <AnimatePresence>
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <ActivityItem key={index} activity={activity} />
          ))}
        </div>
      </AnimatePresence>

      {!loading && activities.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No activity recorded yet
        </div>
      )}
    </div>
  );
}; 
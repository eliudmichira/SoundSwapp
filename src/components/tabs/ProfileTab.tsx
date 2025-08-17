import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Music, 
  CheckCircle, 
  Crown, 
  Settings, 
  Camera, 
  Edit3, 
  Link as LinkIcon, 
  HelpCircle, 
  LogOut, 
  Plus, 
  History,
  ArrowRight,
  Check,
  Youtube,
  Trophy,
  Star,
  Calendar,
  Mail,
  Shield,
  Download,
  Share2,
  Bell,
  Palette,
  Eye,
  EyeOff,
  Trash2,
  Award,
  TrendingUp,
  Clock,
  Target,
  Zap,
  BarChart3,
  Activity,
  Sparkles,
  MapPin,
  Phone
} from 'lucide-react';
import { FaSpotify } from 'react-icons/fa';
import { useAuth } from '../../lib/AuthContext';
import { cn } from '../../lib/utils';
import { EditProfileModal } from '../modals/EditProfileModal';
import { SettingsModal } from '../modals/SettingsModal';
import { HelpModal } from '../modals/HelpModal';
import { PremiumModal } from '../modals/PremiumModal';
import { useNavigate } from 'react-router-dom';
import useMobileDetection from '../../hooks/useMobileDetection';
import { profileService, UserStats, UserProfile } from '../../services/profileService';

interface ProfileTabProps {
  onShowToast?: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
  setActiveTab?: (tab: 'connections' | 'converter' | 'history' | 'profile') => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ onShowToast, setActiveTab }) => {
  const auth = useAuth();
  const { user, signOut } = auth;
  const hasSpotifyAuth = auth?.hasSpotifyAuth || false;
  const hasYouTubeAuth = auth?.hasYouTubeAuth || false;
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [headerPhoto, setHeaderPhoto] = useState<string>('/images/default-avatar.svg');
  
  // Fetch profile photo from auth when component mounts
  useEffect(() => {
    if (user?.photoURL) {
      setHeaderPhoto(user.photoURL);
    }
  }, [user?.photoURL]);

  // Debug showEditProfile state changes
  useEffect(() => {
    console.log('[ProfileTab] showEditProfile state changed to:', showEditProfile);
  }, [showEditProfile]);
  const navigate = useNavigate();
  const { isMobile } = useMobileDetection();

  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.uid) {
        console.log('[ProfileTab] No user UID available, skipping data load');
        return;
      }
      
      console.log('[ProfileTab] Starting to load user data for:', user.uid);
      
      try {
        const [stats, profile] = await Promise.all([
          profileService.getUserStats(user.uid),
          profileService.getUserProfile(user.uid)
        ]);
        
        setUserStats(stats);
        setUserProfile(profile);
      } catch (error) {
        console.error('Error loading user data:', error);
        onShowToast?.('error', 'Failed to load user data');
        
        // Set default values if loading fails
        setUserStats({
          conversions: 0,
          tracks: 0,
          monthlyUsage: 0,
          monthlyLimit: 50,
          platformUsage: {
            spotify: 0,
            youtube: 0,
            soundcloud: 0
          },
          successRate: 0,
          totalPlaylists: 0
        });
        
        setUserProfile({
          id: user.uid,
          displayName: user.displayName || 'User',
          email: user.email || '',
          isPremium: false,
          createdAt: new Date(),
          lastActive: new Date()
        });
      }
    };

    loadUserData();
  }, [user?.uid, onShowToast]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHeaderPhoto(URL.createObjectURL(file));
      onShowToast?.('success', 'Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      onShowToast?.('error', 'Failed to upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      onShowToast?.('success', 'Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      onShowToast?.('error', 'Failed to sign out');
    }
  };

  return (
    <div className="h-full overflow-y-auto pb-[calc(5rem+env(safe-area-inset-bottom))]">
      {/* Profile Header */}
      <div className="px-4 sm:px-6 pt-6 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FF7A59] via-[#FF007A] to-[#00C4CC] p-8 text-white shadow-xl"
        >
          {/* Decorative Elements */}
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
          
          {/* Profile Content */}
          <div className="relative z-10">
                        {/* Profile Information */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-4 sm:space-y-0">
                <div className="flex items-start space-x-4 flex-1 min-w-0">
                  {/* User Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 rounded-full flex items-center justify-center shadow-2xl overflow-hidden border-3 border-white/20">
                      <img
                        src={headerPhoto}
                        alt="Profile"
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          if (!e.currentTarget.src.includes('/images/default-avatar.svg')) {
                            setHeaderPhoto('/images/default-avatar.svg');
                          }
                        }}
                      />
                    </div>
                    <button 
                      onClick={() => document.getElementById('profile-image-input')?.click()}
                      className="absolute -bottom-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white/30 transition-all duration-200 border-2 border-white/30 transform hover:scale-105"
                    >
                      <Camera className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </button>
                    <input
                      id="profile-image-input"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploadingImage}
                    />
                  </div>

                  {/* User Info */}
                  <div className="text-white flex-1 min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold mb-2 truncate">
                      {userProfile?.displayName || user?.displayName || 'User'}
                    </h2>
                    <div className="flex items-center space-x-2 mb-1">
                      <Crown className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                      <span className="text-white/90 text-sm font-medium">
                        {userProfile?.isPremium ? 'Premium Member' : 'Free User'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-white/80 text-sm mb-1 min-w-0">
                      <Mail className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate text-xs sm:text-sm">{user?.email || 'No email'}</span>
                    </div>
                    {userProfile?.bio && (
                      <div className="text-white/70 text-xs mb-1 line-clamp-2">
                        {userProfile.bio}
                      </div>
                    )}
                    {userProfile?.location && (
                      <div className="flex items-center space-x-2 text-white/70 text-xs">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{userProfile.location}</span>
                      </div>
                    )}
                    {userProfile?.isPremium && (
                      <div className="flex items-center space-x-2 mt-1">
                        <Crown className="w-3 h-3 text-yellow-400 flex-shrink-0" />
                        <span className="text-white/80 text-xs">Premium Features Active</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Edit Profile Button */}
                <button
                  onClick={() => {
                    console.log('[ProfileTab] Edit Profile button clicked');
                    setShowEditProfile(true);
                    console.log('[ProfileTab] showEditProfile set to true');
                  }}
                  className="px-3 py-2 sm:px-4 bg-white/20 backdrop-blur-sm rounded-xl flex items-center space-x-2 hover:bg-white/30 transition-colors border border-white/30 flex-shrink-0 sm:ml-4 w-full sm:w-auto justify-center"
                >
                  <Edit3 className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">Edit Profile</span>
                </button>
              </div>
            </div>

                        {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                <div className="flex items-center gap-2 mb-2">
                  <Music className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">Conversions</span>
                </div>
                <div className="text-2xl font-bold text-white">{userStats?.conversions || 0}</div>
                <div className="text-xs text-white/60">Total Playlists</div>
                {userStats?.totalPlaylists && (
                  <div className="text-xs text-white/50 mt-1">
                    {userStats.totalPlaylists} playlists
                  </div>
                )}
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">Tracks</span>
                </div>
                         <div className="text-2xl font-bold text-white">{userStats?.tracks || 0}</div>
         <div className="text-xs text-white/60">Successfully Converted</div>
         {userStats?.successRate !== undefined && (
           <div className="text-xs text-white/50 mt-1">
             {userStats.successRate}% success rate
           </div>
         )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats & Analytics */}
      <div className="px-4 sm:px-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl p-6 border border-border shadow-lg"
        >
          <h3 className="text-lg font-bold text-foreground mb-4">Activity Overview</h3>
          
          {/* Success Rate & Usage */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-4 h-4" />
                <span className="text-sm font-medium">Success Rate</span>
              </div>
              <div className="text-2xl font-bold">{userStats?.successRate || 0}%</div>
              <div className="text-xs text-green-100">Track Success Rate</div>
              {userStats?.tracks && userStats?.successRate && (
                <div className="text-xs text-green-100/70 mt-1">
                  {userStats.tracks} successful tracks
                </div>
              )}
            </div>
            
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-4 text-white">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="w-4 h-4" />
                <span className="text-sm font-medium">Monthly Usage</span>
              </div>
              <div className="text-2xl font-bold">{userStats?.monthlyUsage || 0}/{userStats?.monthlyLimit || 50}</div>
              <div className="text-xs text-blue-100">Conversions used</div>
            </div>
          </div>

          {/* Usage Progress */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">Monthly Progress</span>
              <span className="text-foreground font-semibold text-sm">
                {userStats ? userStats.monthlyLimit - userStats.monthlyUsage : 50} remaining
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" 
                style={{ 
                  width: `${userStats ? (userStats.monthlyUsage / userStats.monthlyLimit) * 100 : 0}%` 
                }}
              ></div>
            </div>
          </div>

          {/* Platform Usage */}
          <div className="space-y-3">
            <h4 className="text-md font-semibold text-foreground">Platform Usage</h4>
            <div className="space-y-3">
              {/* Spotify Usage */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <FaSpotify className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Spotify</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div 
                      className="h-2 bg-green-500 rounded-full" 
                      style={{ 
                        width: `${userStats?.platformUsage?.spotify ? (userStats.platformUsage.spotify / (userStats.conversions || 1)) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground w-8 text-right">
                    {userStats?.platformUsage?.spotify || 0}
                  </span>
                </div>
              </div>

              {/* YouTube Usage */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                    <Youtube className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-foreground">YouTube</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div 
                      className="h-2 bg-red-500 rounded-full" 
                      style={{ 
                        width: `${userStats?.platformUsage?.youtube ? (userStats.platformUsage.youtube / (userStats.conversions || 1)) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground w-8 text-right">
                    {userStats?.platformUsage?.youtube || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

            {/* Detailed User Information */}
      <div className="px-4 sm:px-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl p-6 border border-border shadow-lg"
        >
          <h3 className="text-lg font-bold text-foreground mb-4">Profile Details</h3>
          
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <span className="text-sm text-muted-foreground">Email</span>
                    <p className="text-sm font-medium text-foreground">{user?.email || 'Not available'}</p>
                  </div>
                </div>
                
                {userProfile?.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <span className="text-sm text-muted-foreground">Phone</span>
                      <p className="text-sm font-medium text-foreground">{userProfile.phone}</p>
                    </div>
                  </div>
                )}
                
                {userProfile?.location && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <span className="text-sm text-muted-foreground">Location</span>
                      <p className="text-sm font-medium text-foreground">{userProfile.location}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <span className="text-sm text-muted-foreground">Member Since</span>
                    <p className="text-sm font-medium text-foreground">
                      {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long' 
                      }) : 'Unknown'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <span className="text-sm text-muted-foreground">Last Active</span>
                    <p className="text-sm font-medium text-foreground">
                      {userProfile?.lastActive ? new Date(userProfile.lastActive).toLocaleDateString() : 'Today'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Crown className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <span className="text-sm text-muted-foreground">Account Status</span>
                    <p className="text-sm font-medium text-foreground">
                      {userProfile?.isPremium ? 'Premium' : 'Free'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Music Preferences */}
            {(userProfile?.favoriteGenre || userProfile?.favoriteArtist) && (
              <div className="pt-4 border-t border-border">
                <h4 className="text-md font-semibold text-foreground mb-3">Music Preferences</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {userProfile?.favoriteGenre && (
                    <div className="flex items-center space-x-3">
                      <Music className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <span className="text-sm text-muted-foreground">Favorite Genre</span>
                        <p className="text-sm font-medium text-foreground">{userProfile.favoriteGenre}</p>
                      </div>
                    </div>
                  )}
                  
                  {userProfile?.favoriteArtist && (
                    <div className="flex items-center space-x-3">
                      <Star className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <span className="text-sm text-muted-foreground">Favorite Artist</span>
                        <p className="text-sm font-medium text-foreground">{userProfile.favoriteArtist}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Bio */}
            {userProfile?.bio && (
              <div className="pt-4 border-t border-border">
                <h4 className="text-md font-semibold text-foreground mb-2">Bio</h4>
                <p className="text-sm text-muted-foreground">{userProfile.bio}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Connected Services */}
      <div className="px-4 sm:px-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-xl p-6 border border-border shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground">Connected Services</h3>
            <button
              onClick={() => setActiveTab?.('connections')}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Manage
            </button>
          </div>
            
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Spotify */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <FaSpotify className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Spotify</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {hasSpotifyAuth ? 'Connected' : 'Not connected'}
                  </p>
                </div>
                <div className={`w-3 h-3 rounded-full ${hasSpotifyAuth ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              </div>
            </motion.div>

            {/* YouTube */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <Youtube className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">YouTube</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {hasYouTubeAuth ? 'Connected' : 'Not connected'}
                  </p>
                </div>
                <div className={`w-3 h-3 rounded-full ${hasYouTubeAuth ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              </div>
            </motion.div>

            {/* Apple Music */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-600 rounded-xl flex items-center justify-center">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Apple Music</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Coming Soon
                  </p>
                </div>
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 sm:px-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-xl p-6 border border-border shadow-lg"
        >
          <h3 className="text-lg font-bold text-foreground mb-4">Quick Actions</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* New Conversion */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab?.('converter')}
              className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              <Plus className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold">New Conversion</div>
                <div className="text-sm text-blue-100">Start converting playlists</div>
              </div>
            </motion.button>
            
            {/* View History */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab?.('history')}
              className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white hover:from-green-600 hover:to-emerald-700 transition-all"
            >
              <History className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold">View History</div>
                <div className="text-sm text-green-100">See past conversions</div>
              </div>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Settings & Preferences */}
      <div className="px-4 sm:px-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-xl p-6 border border-border shadow-lg"
        >
          <h3 className="text-lg font-bold text-foreground mb-4">Settings & Preferences</h3>
          
          <div className="space-y-3">
            {/* Theme */}
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <Palette className="w-5 h-5 text-muted-foreground" />
                <div>
                  <span className="text-sm font-medium text-foreground">Theme</span>
                  <p className="text-xs text-muted-foreground">Dark or Light mode</p>
              </div>
              </div>
              <button
                onClick={() => setShowSettings(true)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Configure
              </button>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <span className="text-sm font-medium text-foreground">Notifications</span>
                  <p className="text-xs text-muted-foreground">Conversion updates</p>
              </div>
              </div>
              <button
                onClick={() => setShowSettings(true)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Configure
              </button>
            </div>

            {/* Privacy */}
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <div>
                  <span className="text-sm font-medium text-foreground">Privacy</span>
                  <p className="text-xs text-muted-foreground">Data and security</p>
              </div>
              </div>
              <button
                onClick={() => setShowSettings(true)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Configure
              </button>
            </div>

            {/* Help & Support */}
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <HelpCircle className="w-5 h-5 text-muted-foreground" />
                <div>
                  <span className="text-sm font-medium text-foreground">Help & Support</span>
                  <p className="text-xs text-muted-foreground">Get help and contact us</p>
              </div>
              </div>
              <button
                onClick={() => setShowHelp(true)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Get Help
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Premium Features */}
      {!userProfile?.isPremium && (
      <div className="px-4 sm:px-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Crown className="w-6 h-6 text-yellow-200" />
                <h3 className="text-lg font-bold">Premium Features</h3>
              </div>
              <Sparkles className="w-5 h-5 text-yellow-200" />
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-yellow-200" />
                <span className="text-sm">Unlimited conversions</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-yellow-200" />
                <span className="text-sm">Advanced track matching</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-yellow-200" />
                <span className="text-sm">Priority support</span>
              </div>
            </div>
            
            <button
              onClick={() => setShowPremium(true)}
              className="w-full bg-white/20 backdrop-blur-sm rounded-lg py-3 font-semibold hover:bg-white/30 transition-colors border border-white/30"
            >
              Upgrade to Premium
            </button>
        </motion.div>
      </div>
      )}

      {/* Account Actions */}
      <div className="px-4 sm:px-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-card rounded-xl p-6 border border-border shadow-lg"
        >
          <h3 className="text-lg font-bold text-foreground mb-4">Account Actions</h3>
          
          <div className="space-y-3">
            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
              <div className="flex items-center space-x-3">
                <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
              <div className="text-left">
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">Sign Out</span>
                  <p className="text-xs text-red-500 dark:text-red-400">Log out of your account</p>
            </div>
              </div>
              <ArrowRight className="w-4 h-4 text-red-600 dark:text-red-400" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      {showEditProfile && (
        <EditProfileModal
          isOpen={showEditProfile}
          onClose={() => {
            console.log('[ProfileTab] Closing EditProfileModal');
            setShowEditProfile(false);
          }}
          onShowToast={onShowToast}
        />
      )}

      {showSettings && (
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          onShowToast={onShowToast}
        />
      )}

      {showHelp && (
        <HelpModal
          isOpen={showHelp}
          onClose={() => setShowHelp(false)}
          onShowToast={onShowToast}
        />
      )}

      {showPremium && (
        <PremiumModal
          isOpen={showPremium}
          onClose={() => setShowPremium(false)}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
}; 
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
  Zap
} from 'lucide-react';
import { FaSpotify } from 'react-icons/fa';
import { useAuth } from '../../lib/AuthContext';
import { cn } from '../../lib/utils';
import { EditProfileModal } from '../modals/EditProfileModal';
import { SettingsModal } from '../modals/SettingsModal';
import { HelpModal } from '../modals/HelpModal';
import { PremiumModal } from '../modals/PremiumModal';
import { profileService, UserStats, UserProfile } from '../../services/profileService';

interface ProfileTabProps {
  onShowToast?: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
  setActiveTab?: (tab: 'connections' | 'converter' | 'history' | 'profile') => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ onShowToast, setActiveTab }) => {
  const { user, signOut } = useAuth();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.uid) return;
      
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
          photoURL: user.photoURL || undefined,
          isPremium: false,
          createdAt: new Date(user.metadata.creationTime || Date.now()),
          lastActive: new Date()
        });
      }
    };

    loadUserData();
  }, [user?.uid, onShowToast]);

  const handleSignOut = () => {
    signOut();
    onShowToast?.('success', 'Signed out successfully');
  };

  const handleNewConversion = () => {
    setActiveTab?.('converter');
    onShowToast?.('info', 'Starting new conversion...');
  };

  const handleViewHistory = () => {
    setActiveTab?.('history');
    onShowToast?.('info', 'Opening conversion history...');
  };

  const handleEditProfile = () => {
    setShowEditProfile(true);
  };

  const handleManageConnections = () => {
    setActiveTab?.('connections');
    onShowToast?.('info', 'Opening connection management...');
  };

  const handlePremiumFeatures = () => {
    onShowToast?.('info', 'Premium features coming soon...');
  };

  const handleHelpSupport = () => {
    setShowHelp(true);
  };

  const handleUpgradePremium = () => {
    setShowPremium(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const url = await profileService.uploadProfileImage(user?.uid || '', file);
      if (url) {
        setUserProfile(prev => prev ? { ...prev, photoURL: url } : null);
        onShowToast?.('success', 'Profile image updated successfully!');
      } else {
        onShowToast?.('error', 'Failed to update profile image.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      onShowToast?.('error', 'Failed to update profile image.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* Profile Header Card - Medium Premium Size */}
      <div className="px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FF7A59] via-[#FF007A] to-[#00C4CC] p-8 text-white shadow-xl"
        >
          {/* Decorative Elements */}
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
          
          {/* Profile Content - Medium Size */}
          <div className="relative z-10">
            {/* Edit Button - Top Right */}
            <motion.button
              onClick={handleEditProfile}
              className="absolute top-4 right-4 p-2 bg-white/20 rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Edit3 className="w-4 h-4 text-white" />
            </motion.button>

            {/* Profile Information - Medium Layout */}
            <div className="flex items-center space-x-4 mb-6">
              {/* User Avatar - Medium Size */}
              <div className="relative">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center shadow-2xl overflow-hidden border-2 border-white/10">
                  {userProfile?.photoURL ? (
                    <img 
                      src={userProfile.photoURL} 
                      alt="Profile" 
                      className="w-24 h-24 rounded-full object-cover"
                      onError={(e) => {
                        // Fallback to icon if image fails to load
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <User className={`w-12 h-12 text-white ${userProfile?.photoURL ? 'hidden' : ''}`} />
                </div>
                <button 
                  onClick={() => document.getElementById('profile-image-input')?.click()}
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors"
                >
                  <Camera className="w-4 h-4 text-white" />
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

              {/* User Info - Medium Typography */}
              <div className="text-white">
                <h2 className="text-2xl font-bold mb-2">
                  {userProfile?.displayName || user?.displayName || 'User'}
                </h2>
                <div className="flex items-center space-x-2 mb-1">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  <span className="text-white/90 text-sm font-medium">
                    {userProfile?.isPremium ? 'Premium Member' : 'Free User'}
                  </span>
                </div>
                {userProfile?.isPremium && (
                  <div className="flex items-center space-x-2">
                    <Crown className="w-3 h-3 text-yellow-400" />
                    <span className="text-white/80 text-xs">Premium Features Active</span>
                  </div>
                )}
              </div>
            </div>

            {/* Statistics Cards - Grid Layout */}
            <div className="grid grid-cols-2 gap-6">
              {/* Left Card - Conversions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/20 backdrop-blur-sm rounded-xl p-5 border border-white/30"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Music className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white text-sm font-medium">Conversions</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {userStats?.conversions || 0}
                </div>
                <div className="text-xs text-white/60">Total Playlists</div>
              </motion.div>

              {/* Right Card - Tracks */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/20 backdrop-blur-sm rounded-xl p-5 border border-white/30"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white text-sm font-medium">Tracks</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {userStats?.tracks || 0}
                </div>
                <div className="text-xs text-white/60">Successfully Converted</div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Usage Analytics - Medium Size */}
      <div className="px-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl p-6 border border-border shadow-lg"
        >
          <h3 className="text-lg font-bold text-foreground mb-4">Usage Analytics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">This Month</span>
              <span className="text-foreground font-semibold text-sm">
                {userStats?.monthlyUsage || 0}/{userStats?.monthlyLimit || 50}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ 
                  width: `${userStats ? (userStats.monthlyUsage / userStats.monthlyLimit) * 100 : 0}%` 
                }}
              ></div>
            </div>
            <p className="text-sm text-muted-foreground">
              {userStats ? userStats.monthlyLimit - userStats.monthlyUsage : 50} conversions remaining
            </p>
          </div>
        </motion.div>
      </div>




      {/* Enhanced User Information */}
      <div className="px-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-xl p-6 border border-border shadow-lg"
        >
          <h3 className="text-lg font-bold text-foreground mb-4">Account Information</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Email</span>
              </div>
              <span className="text-sm text-foreground font-medium">
                {userProfile?.email || user?.email || 'Not available'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Member Since</span>
              </div>
              <span className="text-sm text-foreground font-medium">
                {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'Unknown'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Last Active</span>
              </div>
              <span className="text-sm text-foreground font-medium">
                {userProfile?.lastActive ? new Date(userProfile.lastActive).toLocaleDateString() : 'Today'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Account Status</span>
              </div>
              <span className="text-sm text-foreground font-medium">
                {userProfile?.isPremium ? 'Premium' : 'Free'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Platform Usage - Medium Size */}
      <div className="px-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-green-50 dark:bg-green-950/20 rounded-xl p-6 border border-green-200 dark:border-green-800 shadow-lg"
        >
          <h3 className="text-lg font-bold text-foreground mb-4">Platform Usage</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaSpotify className="w-5 h-5 text-green-500" />
                <span className="text-foreground font-medium text-sm">Spotify</span>
              </div>
              <span className="text-muted-foreground text-sm">
                {userStats?.platformUsage?.spotify || 20} conversions
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Youtube className="w-5 h-5 text-red-500" />
                <span className="text-foreground font-medium text-sm">YouTube</span>
              </div>
              <span className="text-muted-foreground text-sm">
                {userStats?.platformUsage?.youtube || 20} conversions
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions - Premium Styling */}
      <div className="px-6 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-bold text-foreground mb-8">Quick Actions</h3>
          <div className="flex space-x-20">
            <motion.button
              onClick={handleNewConversion}
              className="flex-1 bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 text-white py-8 px-8 rounded-2xl font-semibold flex flex-col items-center justify-center space-y-4 shadow-2xl hover:shadow-3xl transition-all duration-300 backdrop-blur-sm border border-white/10"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 25px 50px -12px rgba(239, 68, 68, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <span className="text-white text-lg font-semibold">New Conversion</span>
            </motion.button>
            
            <motion.button
              onClick={handleViewHistory}
              className="flex-1 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 text-white py-8 px-8 rounded-2xl font-semibold flex flex-col items-center justify-center space-y-4 shadow-2xl hover:shadow-3xl transition-all duration-300 backdrop-blur-sm border border-white/10"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <History className="w-8 h-8 text-white" />
              </div>
              <span className="text-white text-lg font-semibold">View History</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Account Settings - Medium Size */}
      <div className="px-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-bold text-foreground">Account Settings</h3>
          
          <motion.button
            onClick={handleEditProfile}
            className="w-full bg-card rounded-xl p-5 flex items-center justify-between border border-border hover:bg-accent/50 transition-colors shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Edit3 className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground text-sm">Edit Profile</p>
                <p className="text-xs text-muted-foreground">Update your information</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          </motion.button>

          <motion.button
            onClick={handleManageConnections}
            className="w-full bg-card rounded-xl p-5 flex items-center justify-between border border-border hover:bg-accent/50 transition-colors shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <LinkIcon className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground text-sm">Manage Connections</p>
                <p className="text-xs text-muted-foreground">Spotify & YouTube accounts</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          </motion.button>

          <motion.button
            onClick={handlePremiumFeatures}
            className="w-full bg-card rounded-xl p-5 flex items-center justify-between border border-border hover:bg-accent/50 transition-colors shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground text-sm">Premium Features</p>
                <p className="text-xs text-muted-foreground">Unlock advanced features</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          </motion.button>

          <motion.button
            onClick={handleHelpSupport}
            className="w-full bg-card rounded-xl p-5 flex items-center justify-between border border-border hover:bg-accent/50 transition-colors shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground text-sm">Help & Support</p>
                <p className="text-xs text-muted-foreground">Get help and contact us</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          </motion.button>
        </motion.div>
      </div>

      {/* Enhanced Settings */}
      <div className="px-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-bold text-foreground">Preferences</h3>
          
          <motion.button
            onClick={() => setShowSettings(true)}
            className="w-full bg-card rounded-xl p-5 flex items-center justify-between border border-border hover:bg-accent/50 transition-colors shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground text-sm">Theme Settings</p>
                <p className="text-xs text-muted-foreground">Customize appearance</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          </motion.button>

          <motion.button
            onClick={() => setShowSettings(true)}
            className="w-full bg-card rounded-xl p-5 flex items-center justify-between border border-border hover:bg-accent/50 transition-colors shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground text-sm">Notifications</p>
                <p className="text-xs text-muted-foreground">Manage alerts and updates</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          </motion.button>

          <motion.button
            onClick={() => setShowSettings(true)}
            className="w-full bg-card rounded-xl p-5 flex items-center justify-between border border-border hover:bg-accent/50 transition-colors shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground text-sm">Privacy & Security</p>
                <p className="text-xs text-muted-foreground">Manage your privacy</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          </motion.button>

          <motion.button
            onClick={() => setShowSettings(true)}
            className="w-full bg-card rounded-xl p-5 flex items-center justify-between border border-border hover:bg-accent/50 transition-colors shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground text-sm">Export Data</p>
                <p className="text-xs text-muted-foreground">Download your data</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          </motion.button>
        </motion.div>
      </div>

      {/* Account Actions */}
      <div className="px-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-bold text-foreground">Account Actions</h3>
          
          <motion.button
            onClick={() => onShowToast?.('warning', 'Account deletion is permanent. Contact support for assistance.')}
            className="w-full bg-red-50 dark:bg-red-950/20 rounded-xl p-5 flex items-center justify-between border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-950/40 transition-colors shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-red-700 dark:text-red-400 text-sm">Delete Account</p>
                <p className="text-xs text-red-600 dark:text-red-500">Permanently remove your account</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-red-500" />
          </motion.button>

          <motion.button
            onClick={handleSignOut}
            className="w-full bg-card rounded-xl p-5 flex items-center justify-between border border-border hover:bg-accent/50 transition-colors shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
                <LogOut className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground text-sm">Sign Out</p>
                <p className="text-xs text-muted-foreground">Log out of your account</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          </motion.button>
        </motion.div>
      </div>

      {/* Premium Features Promotion - Medium Size */}
      <div className="px-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-yellow-50 dark:bg-yellow-950/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800 shadow-lg"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Crown className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <h3 className="text-lg font-bold text-foreground">Premium Features</h3>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-muted-foreground text-sm">Unlimited conversions</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-muted-foreground text-sm">Advanced track matching</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-muted-foreground text-sm">Priority support</span>
            </div>
          </div>

          <motion.button
            onClick={handleUpgradePremium}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 rounded-xl font-semibold shadow-lg text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Upgrade to Premium
          </motion.button>
        </motion.div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <EditProfileModal
          isOpen={showEditProfile}
          onClose={() => setShowEditProfile(false)}
          onShowToast={onShowToast}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          onShowToast={onShowToast}
        />
      )}

      {/* Help Modal */}
      {showHelp && (
        <HelpModal
          isOpen={showHelp}
          onClose={() => setShowHelp(false)}
          onShowToast={onShowToast}
        />
      )}

      {/* Premium Modal */}
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
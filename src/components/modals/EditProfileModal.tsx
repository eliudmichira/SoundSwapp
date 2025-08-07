import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Camera, 
  User, 
  Save, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Edit3, 
  Trash2,
  Upload,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Calendar,
  Music,
  Heart,
  Star,
  Settings,
  Palette,
  Shield,
  Bell
} from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { profileService, UserProfile } from '../../services/profileService';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  onShowToast 
}) => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'social' | 'preferences' | 'security'>('basic');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    phone: '',
    birthDate: '',
    favoriteGenre: '',
    favoriteArtist: '',
    theme: 'dark',
    notifications: {
      email: true,
      push: true,
      conversionComplete: true,
      weeklyReport: false
    },
    privacy: {
      shareStats: false,
      publicProfile: false,
      showEmail: false,
      showLocation: false,
      showStats: true
    }
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user?.uid || !isOpen) return;
      
      try {
        const profile = await profileService.getUserProfile(user.uid);
        const settings = await profileService.getProfileSettings(user.uid);
        
        if (profile) {
          setFormData({
            displayName: profile.displayName || user.displayName || '',
            email: profile.email || user.email || '',
            bio: profile.bio || '',
            location: profile.location || '',
            website: profile.website || '',
            phone: profile.phone || '',
            birthDate: profile.birthDate || '',
            favoriteGenre: profile.favoriteGenre || '',
            favoriteArtist: profile.favoriteArtist || '',
            theme: (settings.theme as 'dark' | 'light' | 'auto') || 'dark',
            notifications: settings.notifications,
            privacy: settings.privacy
          });
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        onShowToast?.('error', 'Failed to load profile data');
      }
    };

    loadUserProfile();
  }, [user?.uid, isOpen, onShowToast]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.uid) return;

    setIsUploading(true);
    try {
      const imageUrl = await profileService.uploadProfileImage(user.uid, file);
      onShowToast?.('success', 'Profile image updated successfully!');
      
      // Update the profile with the new image URL
      await profileService.updateUserProfile(user.uid, { photoURL: imageUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      onShowToast?.('error', 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.uid) return;
    
    setIsSaving(true);
    try {
      // Update profile data
      await profileService.updateUserProfile(user.uid, {
        displayName: formData.displayName,
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
        phone: formData.phone,
        birthDate: formData.birthDate,
        favoriteGenre: formData.favoriteGenre,
        favoriteArtist: formData.favoriteArtist
      });

      // Update settings
      await profileService.updateProfileSettings(user.uid, {
        theme: formData.theme as 'dark' | 'light' | 'auto',
        notifications: formData.notifications,
        privacy: formData.privacy
      });
      
      onShowToast?.('success', 'Profile updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      onShowToast?.('error', 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (category: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...(prev[category as keyof typeof prev] as Record<string, any>),
        [field]: value
      }
    }));
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'social', label: 'Social & Music', icon: Music },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'security', label: 'Privacy', icon: Shield }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
                <p className="text-gray-600 mt-1">Customize your profile and preferences</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Profile Image Section */}
                  <div className="text-center">
                    <div className="relative inline-block">
                      <div className="w-40 h-40 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl border-2 border-white/10">
                        <User className="w-24 h-24 text-white" />
                      </div>
                      <button
                        onClick={() => document.getElementById('profile-image-input')?.click()}
                        disabled={isUploading}
                        className="absolute -bottom-2 -right-2 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                      >
                        {isUploading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Camera className="w-5 h-5 text-white" />
                        )}
                      </button>
                      <input
                        id="profile-image-input"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Click to change profile photo</p>
                  </div>

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your display name"
              />
            </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter your location"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter your website"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Birth Date
              </label>
                      <input
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => handleInputChange('birthDate', e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                </div>
                
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={3}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </motion.div>
              )}

              {/* Social & Music Tab */}
              {activeTab === 'social' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Favorite Genre
                      </label>
                      <select
                        value={formData.favoriteGenre}
                        onChange={(e) => handleInputChange('favoriteGenre', e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="">Select your favorite genre</option>
                        <option value="pop">Pop</option>
                        <option value="rock">Rock</option>
                        <option value="hip-hop">Hip Hop</option>
                        <option value="electronic">Electronic</option>
                        <option value="jazz">Jazz</option>
                        <option value="classical">Classical</option>
                        <option value="country">Country</option>
                        <option value="r&b">R&B</option>
                        <option value="indie">Indie</option>
                        <option value="alternative">Alternative</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Favorite Artist
                      </label>
                <input
                        type="text"
                        value={formData.favoriteArtist}
                        onChange={(e) => handleInputChange('favoriteArtist', e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter your favorite artist"
                />
              </div>
            </div>

                  {/* Music Preferences */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Music className="w-5 h-5 mr-2 text-purple-600" />
                      Music Preferences
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="spotify" className="w-4 h-4 text-purple-600" defaultChecked />
                        <label htmlFor="spotify" className="text-gray-700">Spotify</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="youtube" className="w-4 h-4 text-purple-600" defaultChecked />
                        <label htmlFor="youtube" className="text-gray-700">YouTube</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="apple" className="w-4 h-4 text-purple-600" />
                        <label htmlFor="apple" className="text-gray-700">Apple Music</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="soundcloud" className="w-4 h-4 text-purple-600" />
                        <label htmlFor="soundcloud" className="text-gray-700">SoundCloud</label>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Theme Settings */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Palette className="w-5 h-5 mr-2 text-blue-600" />
                      Theme Settings
                    </h3>
                    <div className="space-y-3">
                      {['light', 'dark', 'auto'].map((theme) => (
                        <label key={theme} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="theme"
                            value={theme}
                            checked={formData.theme === theme}
                            onChange={(e) => handleInputChange('theme', e.target.value)}
                            className="w-4 h-4 text-blue-500"
                          />
                          <span className="text-gray-700 capitalize">{theme} Theme</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Notification Settings */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Bell className="w-5 h-5 mr-2 text-green-600" />
                      Notification Settings
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(formData.notifications).map(([key, value]) => (
                        <label key={key} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => handleNestedChange('notifications', key, e.target.checked)}
                            className="w-4 h-4 text-green-500 rounded"
                          />
                          <span className="text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'security' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Privacy Settings */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-red-600" />
                      Privacy Settings
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(formData.privacy).map(([key, value]) => (
                        <label key={key} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => handleNestedChange('privacy', key, e.target.checked)}
                            className="w-4 h-4 text-red-500 rounded"
                          />
                          <span className="text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Account Security */}
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Security</h3>
                    <div className="space-y-3">
                      <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                        Change Password
                      </button>
                      <button className="w-full bg-green-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
                        Enable Two-Factor Authentication
                      </button>
                      <button className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors">
                        View Login History
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 mt-8 pt-6 border-t">
              <button
                onClick={onClose}
                disabled={isSaving}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 
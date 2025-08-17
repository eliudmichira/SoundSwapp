import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Palette, 
  Bell, 
  Shield, 
  Download, 
  Trash2, 
  Eye, 
  EyeOff,
  Mail,
  Smartphone,
  CheckCircle,
  BarChart3,
  Globe,
  User,
  Save,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { profileService, ProfileSettings } from '../../services/profileService';
import { useNavigate } from 'react-router-dom';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  onShowToast 
}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [settings, setSettings] = useState<ProfileSettings>({
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
    const loadSettings = async () => {
      if (!user?.uid || !isOpen) return;
      
      setIsLoading(true);
      try {
        const userSettings = await profileService.getProfileSettings(user.uid);
        setSettings(userSettings);
      } catch (error) {
        console.error('Error loading settings:', error);
        onShowToast?.('error', 'Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [user?.uid, isOpen, onShowToast]);

  const handleSaveSettings = async () => {
    if (!user?.uid) return;
    
    setIsSaving(true);
    try {
      await profileService.updateProfileSettings(user.uid, settings);
      onShowToast?.('success', 'Settings saved successfully!');
      onClose();
    } catch (error) {
      console.error('Error saving settings:', error);
      onShowToast?.('error', 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = async () => {
    if (!user?.uid) return;
    
    setIsExporting(true);
    try {
      const exportData = await profileService.exportUserData(user.uid);
      
      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `soundswapp-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      onShowToast?.('success', 'Data exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      onShowToast?.('error', 'Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user?.uid) return;
    
    try {
      await profileService.deleteUserAccount(user.uid);
      onShowToast?.('success', 'Account deleted successfully');
      onClose();
      // Sign out user after account deletion
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting account:', error);
      onShowToast?.('error', 'Failed to delete account');
    }
  };

  const updateSetting = (category: keyof ProfileSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] as any),
        [key]: value
      }
    }));
  };

  if (isLoading) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl"
            >
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading settings...</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

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
              <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-8">
              {/* Theme Settings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Palette className="w-5 h-5 mr-2 text-blue-500" />
                  Theme Settings
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="theme"
                      value="light"
                      checked={settings.theme === 'light'}
                      onChange={(e) => updateSetting('theme', 'theme', e.target.value)}
                      className="w-4 h-4 text-blue-500"
                    />
                    <span className="text-gray-700">Light Theme</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="theme"
                      value="dark"
                      checked={settings.theme === 'dark'}
                      onChange={(e) => updateSetting('theme', 'theme', e.target.value)}
                      className="w-4 h-4 text-blue-500"
                    />
                    <span className="text-gray-700">Dark Theme</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="theme"
                      value="auto"
                      checked={settings.theme === 'auto'}
                      onChange={(e) => updateSetting('theme', 'theme', e.target.value)}
                      className="w-4 h-4 text-blue-500"
                    />
                    <span className="text-gray-700">Auto (System)</span>
                  </label>
                </div>
              </div>

              {/* Notification Settings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-green-500" />
                  Notifications
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.email}
                      onChange={(e) => updateSetting('notifications', 'email', e.target.checked)}
                      className="w-4 h-4 text-green-500 rounded"
                    />
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">Email Notifications</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.push}
                      onChange={(e) => updateSetting('notifications', 'push', e.target.checked)}
                      className="w-4 h-4 text-green-500 rounded"
                    />
                    <Smartphone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">Push Notifications</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.conversionComplete}
                      onChange={(e) => updateSetting('notifications', 'conversionComplete', e.target.checked)}
                      className="w-4 h-4 text-green-500 rounded"
                    />
                    <CheckCircle className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">Conversion Complete Alerts</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.weeklyReport}
                      onChange={(e) => updateSetting('notifications', 'weeklyReport', e.target.checked)}
                      className="w-4 h-4 text-green-500 rounded"
                    />
                    <BarChart3 className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">Weekly Usage Reports</span>
                  </label>
                </div>
              </div>

              {/* Privacy Settings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-red-500" />
                  Privacy & Security
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.privacy.shareStats}
                      onChange={(e) => updateSetting('privacy', 'shareStats', e.target.checked)}
                      className="w-4 h-4 text-red-500 rounded"
                    />
                    <BarChart3 className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">Share Usage Statistics</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.privacy.publicProfile}
                      onChange={(e) => updateSetting('privacy', 'publicProfile', e.target.checked)}
                      className="w-4 h-4 text-red-500 rounded"
                    />
                    <Globe className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">Public Profile</span>
                  </label>
                </div>
              </div>

              {/* Data Export */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Download className="w-5 h-5 mr-2 text-orange-500" />
                  Data Export
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Download all your data including profile information, conversion history, and settings.
                </p>
                <button
                  onClick={handleExportData}
                  disabled={isExporting}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {isExporting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span>{isExporting ? 'Exporting...' : 'Export Data'}</span>
                </button>
              </div>

              {/* Account Deletion */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Danger Zone
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Account</span>
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-red-600 font-medium">
                      Are you sure? This will permanently delete your account and all data.
                    </p>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDeleteAccount}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center space-x-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Yes, Delete Account</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 

export const SettingsPage: React.FC<{ onShowToast?: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void }> = ({ onShowToast }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 space-y-8">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => window.history.back()} aria-label="Go back" className="p-2 rounded-full hover:bg-accent">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
      </header>

      <section className="space-y-3">
        <button onClick={() => navigate('/preferences')} className="flex items-center justify-between rounded-xl px-4 py-3 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-violet-600/15 text-violet-400 flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-medium">Preferences</div>
              <div className="text-xs opacity-70">Theme, notifications, privacy, export</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 opacity-70" />
        </button>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>
        <DeleteAccountBlock onShowToast={onShowToast} />
      </section>
    </div>
  );
};

export const PreferencesPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 space-y-8">
      <header className="flex items-center gap-3">
        <button onClick={() => window.history.back()} aria-label="Go back" className="p-2 rounded-full hover:bg-accent">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <h1 className="text-2xl font-bold">Preferences</h1>
      </header>

      <section className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <button onClick={() => navigate('/preferences/theme')} className="flex items-center justify-between rounded-xl px-4 py-3 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-violet-600/15 text-violet-400 flex items-center justify-center">
                <Palette className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-medium">Theme Settings</div>
                <div className="text-xs opacity-70">Customize appearance</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 opacity-70" />
          </button>

          <button onClick={() => navigate('/preferences/notifications')} className="flex items-center justify-between rounded-xl px-4 py-3 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-green-600/15 text-green-400 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-medium">Notifications</div>
                <div className="text-xs opacity-70">Manage alerts and updates</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 opacity-70" />
          </button>

          <button onClick={() => navigate('/preferences/privacy')} className="flex items-center justify-between rounded-xl px-4 py-3 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-600/15 text-red-400 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-medium">Privacy & Security</div>
                <div className="text-xs opacity-70">Manage your privacy</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 opacity-70" />
          </button>

          <button onClick={() => navigate('/preferences/export')} className="flex items-center justify-between rounded-xl px-4 py-3 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-orange-600/15 text-orange-400 flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-medium">Export Data</div>
                <div className="text-xs opacity-70">Download your data</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 opacity-70" />
          </button>
        </div>
      </section>
    </div>
  );
};

// Dedicated subpages
export const ThemeSettingsPage: React.FC<{ onShowToast?: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void }> = ({ onShowToast }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<ProfileSettings>({ theme: 'dark', notifications: { email: true, push: true, conversionComplete: true, weeklyReport: false }, privacy: { shareStats: false, publicProfile: false, showEmail: false, showLocation: false, showStats: true } });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { (async () => { if (!user?.uid) return; try { setSettings(await profileService.getProfileSettings(user.uid)); } catch (e) { console.error(e); onShowToast?.('error','Failed to load settings'); } })(); }, [user?.uid, onShowToast]);

  const save = async () => { if (!user?.uid) return; setIsSaving(true); try { await profileService.updateProfileSettings(user.uid, settings); onShowToast?.('success','Theme saved'); } catch (e) { console.error(e); onShowToast?.('error','Save failed'); } finally { setIsSaving(false); } };

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 space-y-6">
      <Header title="Theme Settings" />
      <div className="space-y-3">
        <label className="flex items-center gap-3"><input type="radio" name="theme" value="light" checked={settings.theme==='light'} onChange={(e)=>setSettings(s=>({ ...s, theme: e.target.value as any }))} /><span>Light</span></label>
        <label className="flex items-center gap-3"><input type="radio" name="theme" value="dark" checked={settings.theme==='dark'} onChange={(e)=>setSettings(s=>({ ...s, theme: e.target.value as any }))} /><span>Dark</span></label>
        <label className="flex items-center gap-3"><input type="radio" name="theme" value="auto" checked={settings.theme==='auto'} onChange={(e)=>setSettings(s=>({ ...s, theme: e.target.value as any }))} /><span>Auto (System)</span></label>
      </div>
      <FooterSave isSaving={isSaving} onSave={save} />
    </div>
  );
};

export const NotificationSettingsPage: React.FC<{ onShowToast?: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void }> = ({ onShowToast }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<ProfileSettings>({ theme: 'dark', notifications: { email: true, push: true, conversionComplete: true, weeklyReport: false }, privacy: { shareStats: false, publicProfile: false, showEmail: false, showLocation: false, showStats: true } });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { (async () => { if (!user?.uid) return; try { setSettings(await profileService.getProfileSettings(user.uid)); } catch (e) { console.error(e); onShowToast?.('error','Failed to load settings'); } })(); }, [user?.uid, onShowToast]);

  const save = async () => { if (!user?.uid) return; setIsSaving(true); try { await profileService.updateProfileSettings(user.uid, settings); onShowToast?.('success','Notifications saved'); } catch (e) { console.error(e); onShowToast?.('error','Save failed'); } finally { setIsSaving(false); } };

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 space-y-6">
      <Header title="Notifications" />
      <div className="space-y-4">
        <ToggleRow checked={settings.notifications.email} onChange={(v)=>setSettings(s=>({ ...s, notifications: { ...s.notifications, email: v } }))} icon={<Mail className="w-4 h-4"/>} label="Email Notifications" />
        <ToggleRow checked={settings.notifications.push} onChange={(v)=>setSettings(s=>({ ...s, notifications: { ...s.notifications, push: v } }))} icon={<Smartphone className="w-4 h-4"/>} label="Push Notifications" />
        <ToggleRow checked={settings.notifications.conversionComplete} onChange={(v)=>setSettings(s=>({ ...s, notifications: { ...s.notifications, conversionComplete: v } }))} icon={<CheckCircle className="w-4 h-4"/>} label="Conversion Complete Alerts" />
        <ToggleRow checked={settings.notifications.weeklyReport} onChange={(v)=>setSettings(s=>({ ...s, notifications: { ...s.notifications, weeklyReport: v } }))} icon={<BarChart3 className="w-4 h-4"/>} label="Weekly Usage Reports" />
      </div>
      <FooterSave isSaving={isSaving} onSave={save} />
    </div>
  );
};

export const PrivacySettingsPage: React.FC<{ onShowToast?: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void }> = ({ onShowToast }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<ProfileSettings>({ theme: 'dark', notifications: { email: true, push: true, conversionComplete: true, weeklyReport: false }, privacy: { shareStats: false, publicProfile: false, showEmail: false, showLocation: false, showStats: true } });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { (async () => { if (!user?.uid) return; try { setSettings(await profileService.getProfileSettings(user.uid)); } catch (e) { console.error(e); onShowToast?.('error','Failed to load settings'); } })(); }, [user?.uid, onShowToast]);

  const save = async () => { if (!user?.uid) return; setIsSaving(true); try { await profileService.updateProfileSettings(user.uid, settings); onShowToast?.('success','Privacy settings saved'); } catch (e) { console.error(e); onShowToast?.('error','Save failed'); } finally { setIsSaving(false); } };

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 space-y-6">
      <Header title="Privacy & Security" />
      <div className="space-y-4">
        <ToggleRow checked={settings.privacy.shareStats} onChange={(v)=>setSettings(s=>({ ...s, privacy: { ...s.privacy, shareStats: v } }))} icon={<BarChart3 className="w-4 h-4"/>} label="Share Usage Statistics" />
        <ToggleRow checked={settings.privacy.publicProfile} onChange={(v)=>setSettings(s=>({ ...s, privacy: { ...s.privacy, publicProfile: v } }))} icon={<Globe className="w-4 h-4"/>} label="Public Profile" />
        <ToggleRow checked={settings.privacy.showEmail} onChange={(v)=>setSettings(s=>({ ...s, privacy: { ...s.privacy, showEmail: v } }))} icon={<Mail className="w-4 h-4"/>} label="Show Email" />
        <ToggleRow checked={settings.privacy.showLocation} onChange={(v)=>setSettings(s=>({ ...s, privacy: { ...s.privacy, showLocation: v } }))} icon={<User className="w-4 h-4"/>} label="Show Location" />
        <ToggleRow checked={settings.privacy.showStats} onChange={(v)=>setSettings(s=>({ ...s, privacy: { ...s.privacy, showStats: v } }))} icon={<BarChart3 className="w-4 h-4"/>} label="Show Stats on Profile" />
      </div>
      <FooterSave isSaving={isSaving} onSave={save} />
    </div>
  );
};

export const DataExportPage: React.FC<{ onShowToast?: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void }> = ({ onShowToast }) => {
  const { user } = useAuth();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportData = async () => {
    if (!user?.uid) return;
    setIsExporting(true);
    try {
      const exportData = await profileService.exportUserData(user.uid);
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `soundswapp-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
      onShowToast?.('success', 'Data exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      onShowToast?.('error', 'Failed to export data');
    } finally { setIsExporting(false); }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 space-y-6">
      <Header title="Export Data" />
      <p className="text-sm opacity-80">Download all your data including profile information, conversion history, and settings.</p>
      <button onClick={handleExportData} disabled={isExporting} className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center gap-2 w-max">
        {isExporting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Download className="w-4 h-4" />}<span>{isExporting ? 'Exporting…' : 'Export Data'}</span>
      </button>
    </div>
  );
};

// Reusable pieces
const Header: React.FC<{ title: string }> = ({ title }) => (
  <header className="flex items-center gap-3">
    <button onClick={() => window.history.back()} aria-label="Go back" className="p-2 rounded-full hover:bg-accent">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
    </button>
    <h1 className="text-2xl font-bold">{title}</h1>
  </header>
);

const FooterSave: React.FC<{ isSaving: boolean; onSave: () => void }> = ({ isSaving, onSave }) => (
  <div className="pt-4">
    <button onClick={onSave} disabled={isSaving} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg font-medium disabled:opacity-50">
      {isSaving ? 'Saving…' : 'Save'}
    </button>
  </div>
);

const ToggleRow: React.FC<{ checked: boolean; onChange: (v: boolean)=>void; icon: React.ReactNode; label: string }> = ({ checked, onChange, icon, label }) => (
  <label className="flex items-center gap-3 cursor-pointer">
    <input type="checkbox" checked={checked} onChange={(e)=>onChange(e.target.checked)} className="w-4 h-4" />
    <span className="opacity-70">{icon}</span>
    <span>{label}</span>
  </label>
);

const DeleteAccountBlock: React.FC<{ onShowToast?: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void }> = ({ onShowToast }) => {
  const { user } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const handleDeleteAccount = async () => {
    if (!user?.uid) return;
    try { await profileService.deleteUserAccount(user.uid); onShowToast?.('success', 'Account deleted'); window.location.href = '/'; }
    catch (error) { console.error('Delete error:', error); onShowToast?.('error', 'Failed to delete account'); }
  };
  return (
    <div className="border border-red-500/20 rounded-xl p-4">
      <h3 className="text-lg font-semibold text-red-600 mb-2 flex items-center gap-2"><AlertTriangle className="w-5 h-5"/>Danger Zone</h3>
      <p className="text-sm opacity-80 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
      {!showDeleteConfirm ? (
        <button onClick={() => setShowDeleteConfirm(true)} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center gap-2">
          <Trash2 className="w-4 h-4" /> Delete Account
        </button>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-red-600 font-medium">Are you sure? This will permanently delete your account and all data.</p>
          <div className="flex gap-3">
            <button onClick={() => setShowDeleteConfirm(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors">Cancel</button>
            <button onClick={handleDeleteAccount} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center gap-2"><Trash2 className="w-4 h-4" /> Yes, Delete Account</button>
          </div>
        </div>
      )}
    </div>
  );
}; 
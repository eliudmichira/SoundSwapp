import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Link as LinkIcon, History, User } from 'lucide-react';
import { ResponsiveLayout, MobileHeader, MobileContent, MobileBottomNav, MobileNavItem } from './ResponsiveLayout';
import { useAuth } from '../lib/AuthContext';
import { ConversionFlowProvider } from '../contexts/ConversionFlowContext';
import { UIStateProvider, useUIState } from '../contexts/UIStateContext';
import { NotificationProvider, useNotification } from '../contexts/NotificationContext';
import { ConverterTab } from './tabs/ConverterTab';
import { ConnectionsTab } from './tabs/ConnectionsTab';
import { HistoryTab } from './tabs/HistoryTab';
import { ProfileTab } from './tabs/ProfileTab';
import { ANIMATION_VARIANTS } from '../config/animations';

const TabRouter: React.FC = () => {
  const { activeTab } = useUIState();
  const { showToast } = useNotification();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        variants={ANIMATION_VARIANTS.fadeIn}
        initial="initial"
        animate="animate"
        exit="exit"
        className="h-full"
      >
        {activeTab === 'converter' && <ConverterTab />}
        {activeTab === 'connections' && <ConnectionsTab />}
        {activeTab === 'history' && <HistoryTab />}
        {activeTab === 'profile' && <ProfileTab onShowToast={showToast} />}
      </motion.div>
    </AnimatePresence>
  );
};

const Navigation: React.FC = () => {
  const { activeTab, setActiveTab } = useUIState();

  return (
    <MobileBottomNav>
      <MobileNavItem
        icon={<Home />}
        label="Convert"
        active={activeTab === 'converter'}
        onClick={() => setActiveTab('converter')}
      />
      <MobileNavItem
        icon={<LinkIcon />}
        label="Connections"
        active={activeTab === 'connections'}
        onClick={() => setActiveTab('connections')}
      />
      <MobileNavItem
        icon={<History />}
        label="History"
        active={activeTab === 'history'}
        onClick={() => setActiveTab('history')}
      />
      <MobileNavItem
        icon={<User />}
        label="Profile"
        active={activeTab === 'profile'}
        onClick={() => setActiveTab('profile')}
      />
    </MobileBottomNav>
  );
};

const MobileConverterModular: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please log in to continue</h1>
          <p className="text-gray-300">You need to be logged in to use the converter.</p>
        </div>
      </div>
    );
  }

  return (
    <ConversionFlowProvider>
      <UIStateProvider>
        <NotificationProvider>
          <ResponsiveLayout>
            <MobileHeader>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-white font-semibold">SoundSwapp</span>
              </div>
            </MobileHeader>

            <MobileContent>
              <TabRouter />
            </MobileContent>

            <Navigation />
          </ResponsiveLayout>
        </NotificationProvider>
      </UIStateProvider>
    </ConversionFlowProvider>
  );
};

export default MobileConverterModular; 
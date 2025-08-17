import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Bookmark } from 'lucide-react';
import { cn, safeArrayIncludes } from '../lib/utils';

interface Service {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface SafeServiceComponentProps {
  services: Service[];
  className?: string;
}

export const SafeServiceComponent: React.FC<SafeServiceComponentProps> = ({
  services,
  className
}) => {
  // Initialize with empty arrays to prevent errors
  const [likedServices, setLikedServices] = useState<string[]>([]);
  const [bookmarkedServices, setBookmarkedServices] = useState<string[]>([]);

  // Load user preferences safely
  useEffect(() => {
    const loadUserPreferences = async () => {
      try {
        // Load from localStorage or API
        const storedLiked = localStorage.getItem('likedServices');
        const storedBookmarked = localStorage.getItem('bookmarkedServices');
        
        if (storedLiked) {
          const parsed = JSON.parse(storedLiked);
          setLikedServices(Array.isArray(parsed) ? parsed : []);
        }
        
        if (storedBookmarked) {
          const parsed = JSON.parse(storedBookmarked);
          setBookmarkedServices(Array.isArray(parsed) ? parsed : []);
        }
      } catch (error) {
        console.error('Error loading user preferences:', error);
        // Set empty arrays as fallback
        setLikedServices([]);
        setBookmarkedServices([]);
      }
    };

    loadUserPreferences();
  }, []);

  const toggleLiked = (serviceId: string) => {
    setLikedServices(prev => {
      const newLiked = safeArrayIncludes(prev, serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId];
      
      // Save to localStorage
      try {
        localStorage.setItem('likedServices', JSON.stringify(newLiked));
      } catch (error) {
        console.error('Error saving liked services:', error);
      }
      
      return newLiked;
    });
  };

  const toggleBookmarked = (serviceId: string) => {
    setBookmarkedServices(prev => {
      const newBookmarked = safeArrayIncludes(prev, serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId];
      
      // Save to localStorage
      try {
        localStorage.setItem('bookmarkedServices', JSON.stringify(newBookmarked));
      } catch (error) {
        console.error('Error saving bookmarked services:', error);
      }
      
      return newBookmarked;
    });
  };

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
      {services.map((service) => (
        <motion.div
          key={service.id}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {service.icon}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {service.name}
              </h3>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Safe like button */}
              <button
                onClick={() => toggleLiked(service.id)}
                className={cn(
                  'p-2 rounded-full transition-colors',
                  safeArrayIncludes(likedServices, service.id)
                    ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                )}
              >
                <Heart className="w-5 h-5" fill={safeArrayIncludes(likedServices, service.id) ? 'currentColor' : 'none'} />
              </button>
              
              {/* Safe bookmark button */}
              <button
                onClick={() => toggleBookmarked(service.id)}
                className={cn(
                  'p-2 rounded-full transition-colors',
                  safeArrayIncludes(bookmarkedServices, service.id)
                    ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                )}
              >
                <Bookmark className="w-5 h-5" fill={safeArrayIncludes(bookmarkedServices, service.id) ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300">
            {service.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}; 
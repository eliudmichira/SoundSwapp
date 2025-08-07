import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  HelpCircle, 
  BookOpen, 
  MessageCircle, 
  Mail, 
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Play,
  Music,
  Youtube,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { FaSpotify } from 'react-icons/fa';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
}

interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'conversion' | 'technical' | 'account';
}

const faqData: FAQItem[] = [
  {
    question: "How do I convert a playlist from Spotify to YouTube?",
    answer: "1. Connect your Spotify account\n2. Connect your YouTube account\n3. Select a Spotify playlist as source\n4. Choose YouTube as destination\n5. Click 'Start Conversion' and wait for the process to complete.",
    category: "conversion"
  },
  {
    question: "How do I convert a playlist from YouTube to Spotify?",
    answer: "1. Connect your YouTube account\n2. Connect your Spotify account\n3. Select a YouTube playlist as source\n4. Choose Spotify as destination\n5. Click 'Start Conversion' and wait for the process to complete.",
    category: "conversion"
  },
  {
    question: "Why are some tracks not found during conversion?",
    answer: "Tracks may not be found due to:\n• Different song titles or artist names\n• Regional availability differences\n• Explicit content restrictions\n• Platform-specific licensing\n\nThe app will show you which tracks failed and why.",
    category: "conversion"
  },
  {
    question: "How accurate is the track matching?",
    answer: "Our matching algorithm uses multiple factors:\n• Song title similarity\n• Artist name matching\n• Duration comparison\n• Popularity indicators\n\nWe aim for 85%+ accuracy, but results may vary.",
    category: "technical"
  },
  {
    question: "What are the conversion limits?",
    answer: "Free users: 50 conversions per month\nPremium users: Unlimited conversions\n\nEach playlist conversion counts as 1 conversion, regardless of track count.",
    category: "account"
  },
  {
    question: "How do I connect my Spotify account?",
    answer: "1. Click 'Connect Spotify' on the connections page\n2. Log in to your Spotify account\n3. Grant permission to access your playlists\n4. Your account will be connected and ready to use.",
    category: "general"
  },
  {
    question: "How do I connect my YouTube account?",
    answer: "1. Click 'Connect YouTube' on the connections page\n2. Log in to your Google account\n3. Grant permission to access your YouTube playlists\n4. Your account will be connected and ready to use.",
    category: "general"
  },
  {
    question: "Can I convert private playlists?",
    answer: "Yes! You can convert both public and private playlists. The converted playlist will be created as private by default for your privacy.",
    category: "conversion"
  },
  {
    question: "What happens if my connection expires?",
    answer: "If your connection expires, you'll see a 'Reconnect' button. Simply click it and log in again to restore access to your playlists.",
    category: "account"
  },
  {
    question: "How do I view my conversion history?",
    answer: "Go to the 'History' tab in your profile to see all your past conversions, including success rates and failed tracks.",
    category: "general"
  }
];

export const HelpModal: React.FC<HelpModalProps> = ({ 
  isOpen, 
  onClose, 
  onShowToast 
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'general' | 'conversion' | 'technical' | 'account'>('all');
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const filteredFAQ = activeCategory === 'all' 
    ? faqData 
    : faqData.filter(item => item.category === activeCategory);

  const handleContactSupport = () => {
    const subject = encodeURIComponent('SoundSwapp Support Request');
    const body = encodeURIComponent(`Hello SoundSwapp Support Team,

I need help with the following issue:

[Please describe your issue here]

My account details:
- Email: [Your email]
- Issue encountered: [Date and time]

Thank you for your assistance.

Best regards,
[Your name]`);
    
    window.open(`mailto:support@soundswapp.com?subject=${subject}&body=${body}`, '_blank');
  };

  const categories = [
    { key: 'all', label: 'All Questions', icon: HelpCircle },
    { key: 'general', label: 'Getting Started', icon: BookOpen },
    { key: 'conversion', label: 'Conversion Process', icon: Play },
    { key: 'technical', label: 'Technical Issues', icon: AlertCircle },
    { key: 'account', label: 'Account & Limits', icon: Info }
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
            className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Help & Support</h2>
                <p className="text-gray-600 mt-1">Find answers to common questions and get support</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Sidebar - Categories */}
              <div className="lg:col-span-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.key}
                        onClick={() => setActiveCategory(category.key as any)}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                          activeCategory === category.key
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{category.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Contact Support */}
                <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Need More Help?</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Can't find what you're looking for? Contact our support team.
                  </p>
                  <button
                    onClick={handleContactSupport}
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Contact Support</span>
                  </button>
                </div>
              </div>

              {/* Right Side - FAQ Content */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {activeCategory === 'all' ? 'Frequently Asked Questions' : `${categories.find(c => c.key === activeCategory)?.label}`}
                </h3>
                
                <div className="space-y-4">
                  {filteredFAQ.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleExpanded(index)}
                        className="w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                      >
                        <span className="font-medium text-gray-900">{item.question}</span>
                        {expandedItems.has(index) ? (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                      
                      <AnimatePresence>
                        {expandedItems.has(index) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-4 pb-4"
                          >
                            <div className="text-gray-700 whitespace-pre-line">
                              {item.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>

                {/* Quick Start Guide */}
                <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Play className="w-5 h-5 mr-2 text-green-500" />
                    Quick Start Guide
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                                             <h5 className="font-medium text-gray-900 flex items-center">
                         <FaSpotify className="w-4 h-4 mr-2 text-green-500" />
                         Spotify to YouTube
                       </h5>
                      <ol className="text-sm text-gray-600 space-y-1">
                        <li>1. Connect both accounts</li>
                        <li>2. Select Spotify playlist</li>
                        <li>3. Choose YouTube destination</li>
                        <li>4. Start conversion</li>
                      </ol>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-900 flex items-center">
                        <Youtube className="w-4 h-4 mr-2 text-red-500" />
                        YouTube to Spotify
                      </h5>
                      <ol className="text-sm text-gray-600 space-y-1">
                        <li>1. Connect both accounts</li>
                        <li>2. Select YouTube playlist</li>
                        <li>3. Choose Spotify destination</li>
                        <li>4. Start conversion</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Crown, 
  Check, 
  Star,
  Zap,
  Shield,
  Download,
  Users,
  Music,
  ArrowRight,
  AlertCircle,
  Calendar,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { paymentService, PaymentPlan } from '../../services/paymentService';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ 
  isOpen, 
  onClose, 
  onShowToast 
}) => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<PaymentPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>('premium-monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);

  useEffect(() => {
    const loadPlans = async () => {
      if (!isOpen) return;
      
      setIsLoading(true);
      try {
        const availablePlans = await paymentService.getPaymentPlans();
        setPlans(availablePlans);
      } catch (error) {
        console.error('Error loading plans:', error);
        onShowToast?.('error', 'Failed to load payment plans');
      } finally {
        setIsLoading(false);
      }
    };

    const loadSubscriptionDetails = async () => {
      if (!user?.uid || !isOpen) return;
      
      try {
        const details = await paymentService.getSubscriptionDetails(user.uid);
        setSubscriptionDetails(details);
      } catch (error) {
        console.error('Error loading subscription details:', error);
      }
    };

    loadPlans();
    loadSubscriptionDetails();
  }, [isOpen, user?.uid, onShowToast]);

  const handleUpgrade = async () => {
    if (!user?.uid) return;
    
    setIsProcessing(true);
    try {
      // Create checkout session
      const sessionId = await paymentService.createCheckoutSession(selectedPlan, user.uid);
      
      // Redirect to Stripe checkout
      await paymentService.redirectToCheckout(sessionId);
    } catch (error) {
      console.error('Error starting checkout:', error);
      onShowToast?.('error', 'Failed to start checkout process');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!user?.uid) return;
    
    setIsProcessing(true);
    try {
      await paymentService.cancelSubscription(user.uid);
      onShowToast?.('success', 'Subscription canceled successfully');
      onClose();
    } catch (error) {
      console.error('Error canceling subscription:', error);
      onShowToast?.('error', 'Failed to cancel subscription');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReactivateSubscription = async () => {
    if (!user?.uid) return;
    
    setIsProcessing(true);
    try {
      await paymentService.reactivateSubscription(user.uid);
      onShowToast?.('success', 'Subscription reactivated successfully');
      onClose();
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      onShowToast?.('error', 'Failed to reactivate subscription');
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedPlanData = plans.find(plan => plan.id === selectedPlan);

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
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Crown className="w-6 h-6 mr-2 text-yellow-500" />
                  Upgrade to Premium
                </h2>
                <p className="text-gray-600 mt-1">Unlock unlimited conversions and advanced features</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Current Subscription Status */}
            {subscriptionDetails && (
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-2">Current Subscription</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Plan:</span>
                    <span className="ml-2 font-medium">{subscriptionDetails.planName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className={`ml-2 font-medium ${
                      subscriptionDetails.isPremium ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {subscriptionDetails.status}
                    </span>
                  </div>
                  {subscriptionDetails.nextBillingDate && (
                    <div>
                      <span className="text-gray-600">Next billing:</span>
                      <span className="ml-2 font-medium">
                        {new Date(subscriptionDetails.nextBillingDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
                
                {subscriptionDetails.cancelAtPeriodEnd && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
                      <span className="text-sm text-yellow-800">
                        Your subscription will end on {new Date(subscriptionDetails.nextBillingDate).toLocaleDateString()}
                      </span>
                    </div>
                    <button
                      onClick={handleReactivateSubscription}
                      disabled={isProcessing}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Reactivate Subscription
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Payment Plans */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Plan</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedPlan === plan.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">{plan.name}</h4>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          ${plan.price}
                        </div>
                        <div className="text-sm text-gray-600">
                          per {plan.interval}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <Check className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    {plan.id === 'premium-yearly' && (
                      <div className="mb-4 p-2 bg-green-100 border border-green-200 rounded-lg">
                        <div className="flex items-center text-sm text-green-800">
                          <Star className="w-4 h-4 mr-1" />
                          Save 20% with yearly billing
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Premium Features */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Premium Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <div className="flex items-center mb-2">
                    <Zap className="w-5 h-5 text-purple-600 mr-2" />
                    <span className="font-semibold text-gray-900">Unlimited Conversions</span>
                  </div>
                  <p className="text-sm text-gray-600">Convert as many playlists as you want</p>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <div className="flex items-center mb-2">
                    <Music className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-semibold text-gray-900">Advanced Matching</span>
                  </div>
                  <p className="text-sm text-gray-600">Better track matching algorithms</p>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="flex items-center mb-2">
                    <Shield className="w-5 h-5 text-green-600 mr-2" />
                    <span className="font-semibold text-gray-900">Priority Support</span>
                  </div>
                  <p className="text-sm text-gray-600">Get help faster with priority support</p>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200">
                  <div className="flex items-center mb-2">
                    <Download className="w-5 h-5 text-orange-600 mr-2" />
                    <span className="font-semibold text-gray-900">Unlimited Exports</span>
                  </div>
                  <p className="text-sm text-gray-600">Export unlimited data and reports</p>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center mb-2">
                    <Users className="w-5 h-5 text-yellow-600 mr-2" />
                    <span className="font-semibold text-gray-900">Custom Names</span>
                  </div>
                  <p className="text-sm text-gray-600">Customize playlist names during conversion</p>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg border border-pink-200">
                  <div className="flex items-center mb-2">
                    <Crown className="w-5 h-5 text-pink-600 mr-2" />
                    <span className="font-semibold text-gray-900">No Ads</span>
                  </div>
                  <p className="text-sm text-gray-600">Enjoy an ad-free experience</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              
              {subscriptionDetails?.isPremium ? (
                <button
                  onClick={handleCancelSubscription}
                  disabled={isProcessing}
                  className="flex-1 bg-red-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Calendar className="w-4 h-4" />
                  )}
                  <span>{isProcessing ? 'Processing...' : 'Cancel Subscription'}</span>
                </button>
              ) : (
                <button
                  onClick={handleUpgrade}
                  disabled={isProcessing || isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <CreditCard className="w-4 h-4" />
                  )}
                  <span>
                    {isProcessing ? 'Processing...' : `Upgrade to ${selectedPlanData?.name || 'Premium'}`}
                  </span>
                  {!isProcessing && <ArrowRight className="w-4 h-4" />}
                </button>
              )}
            </div>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">Secure Payment Processing</p>
                  <p>Your payment information is securely processed by Stripe. We never store your credit card details.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 
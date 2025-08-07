import { db } from '../lib/firebase';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';

export interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PaymentService {
  private static instance: PaymentService;
  private stripe: any = null;

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  constructor() {
    this.initializeStripe();
  }

  private async initializeStripe() {
    try {
      // Dynamically import Stripe to avoid SSR issues
      const { loadStripe } = await import('@stripe/stripe-js');
      const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
      
      if (!publishableKey) {
        console.warn('Stripe publishable key not found. Payment features will be disabled.');
        return;
      }
      
      this.stripe = await loadStripe(publishableKey);
    } catch (error) {
      console.error('Failed to initialize Stripe:', error);
    }
  }

  // Get available payment plans
  async getPaymentPlans(): Promise<PaymentPlan[]> {
    return [
      {
        id: 'premium-monthly',
        name: 'Premium Monthly',
        price: 9.99,
        currency: 'USD',
        interval: 'month',
        features: [
          'Unlimited conversions',
          'Advanced track matching',
          'Priority support',
          'No ads',
          'Export unlimited data',
          'Custom playlist names'
        ],
        stripePriceId: import.meta.env.VITE_STRIPE_PREMIUM_MONTHLY_PRICE_ID
      },
      {
        id: 'premium-yearly',
        name: 'Premium Yearly',
        price: 99.99,
        currency: 'USD',
        interval: 'year',
        features: [
          'Unlimited conversions',
          'Advanced track matching',
          'Priority support',
          'No ads',
          'Export unlimited data',
          'Custom playlist names',
          '2 months free (save 20%)'
        ],
        stripePriceId: import.meta.env.VITE_STRIPE_PREMIUM_YEARLY_PRICE_ID
      }
    ];
  }

  // Create a checkout session
  async createCheckoutSession(planId: string, userId: string): Promise<string> {
    try {
      const plans = await this.getPaymentPlans();
      const plan = plans.find(p => p.id === planId);
      
      if (!plan) {
        throw new Error('Invalid plan selected');
      }

      // Import the payment API
      const { paymentAPI } = await import('../api/paymentApi');
      
      const response = await paymentAPI.createCheckoutSession({
        planId,
        userId,
        stripePriceId: plan.stripePriceId,
        successUrl: `${window.location.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/payment/cancel`,
      });

      return response.sessionId;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw new Error('Failed to create checkout session');
    }
  }

  // Redirect to Stripe checkout
  async redirectToCheckout(sessionId: string): Promise<void> {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    const { error } = await this.stripe.redirectToCheckout({
      sessionId,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  // Handle successful payment
  async handlePaymentSuccess(sessionId: string, userId: string): Promise<void> {
    try {
      // Import the payment API
      const { paymentAPI } = await import('../api/paymentApi');
      
      // Verify the session with your backend
      const response = await paymentAPI.verifyPayment({
        sessionId,
        userId,
      });

      // Update user profile to premium
      await this.updateUserToPremium(userId, response.subscription);
    } catch (error) {
      console.error('Error handling payment success:', error);
      throw error;
    }
  }

  // Update user to premium status
  private async updateUserToPremium(userId: string, subscription: any): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      
      // Update user profile
      await updateDoc(userRef, {
        'isPremium': true,
        'premiumSince': new Date(),
        'subscription': {
          id: subscription.id,
          status: subscription.status,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          stripeSubscriptionId: subscription.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        'lastUpdated': new Date()
      });

      console.log('User upgraded to premium successfully');
    } catch (error) {
      console.error('Error updating user to premium:', error);
      throw error;
    }
  }

  // Get user subscription
  async getUserSubscription(userId: string): Promise<Subscription | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (!userDoc.exists()) {
        return null;
      }

      const userData = userDoc.data();
      return userData.subscription || null;
    } catch (error) {
      console.error('Error getting user subscription:', error);
      return null;
    }
  }

  // Cancel subscription
  async cancelSubscription(userId: string): Promise<void> {
    try {
      const subscription = await this.getUserSubscription(userId);
      
      if (!subscription) {
        throw new Error('No active subscription found');
      }

      // Import the payment API
      const { paymentAPI } = await import('../api/paymentApi');
      
      await paymentAPI.cancelSubscription(subscription.stripeSubscriptionId, userId);

      // Update local subscription status
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        'subscription.status': 'canceled',
        'subscription.cancelAtPeriodEnd': true,
        'subscription.updatedAt': new Date()
      });

      console.log('Subscription canceled successfully');
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  // Reactivate subscription
  async reactivateSubscription(userId: string): Promise<void> {
    try {
      const subscription = await this.getUserSubscription(userId);
      
      if (!subscription) {
        throw new Error('No subscription found');
      }

      // Import the payment API
      const { paymentAPI } = await import('../api/paymentApi');
      
      await paymentAPI.reactivateSubscription(subscription.stripeSubscriptionId, userId);

      // Update local subscription status
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        'subscription.status': 'active',
        'subscription.cancelAtPeriodEnd': false,
        'subscription.updatedAt': new Date()
      });

      console.log('Subscription reactivated successfully');
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      throw error;
    }
  }

  // Check if user has active premium
  async hasActivePremium(userId: string): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(userId);
      
      if (!subscription) {
        return false;
      }

      return subscription.status === 'active' && !subscription.cancelAtPeriodEnd;
    } catch (error) {
      console.error('Error checking premium status:', error);
      return false;
    }
  }

  // Get subscription details for display
  async getSubscriptionDetails(userId: string): Promise<{
    isPremium: boolean;
    planName: string;
    nextBillingDate: Date | null;
    cancelAtPeriodEnd: boolean;
    status: string;
  } | null> {
    try {
      const subscription = await this.getUserSubscription(userId);
      
      if (!subscription) {
        return null;
      }

      return {
        isPremium: subscription.status === 'active' && !subscription.cancelAtPeriodEnd,
        planName: subscription.planId === 'premium-monthly' ? 'Premium Monthly' : 'Premium Yearly',
        nextBillingDate: subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        status: subscription.status
      };
    } catch (error) {
      console.error('Error getting subscription details:', error);
      return null;
    }
  }
}

// Export singleton instance
export const paymentService = PaymentService.getInstance(); 
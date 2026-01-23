const { loadStripe } = require('@stripe/stripe-js');

let stripePromise;

/**
 * Get Stripe instance with publishable key
 * Uses singleton pattern to ensure only one instance is created
 * @returns {Promise<Stripe | null>} Stripe instance or null if key is missing
 */
const getStripePromise = () => {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

  if (!key) {
    console.warn('Stripe publishable key is not configured');
    return null;
  }

  if (!stripePromise) {
    stripePromise = loadStripe(key);
  }
  
  return stripePromise;
};

module.exports = getStripePromise;

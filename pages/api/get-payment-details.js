const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Retrieve Stripe Checkout Session Details
 * Used to verify payment status after successful checkout
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { session_id } = req.query;

    // Validate session_id
    if (!session_id) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    // Validate Stripe secret key
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('Stripe secret key is not configured');
      return res.status(500).json({ error: 'Payment service configuration error' });
    }

    // Retrieve checkout session with expanded payment intent
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['payment_intent', 'customer', 'line_items'],
    });

    // Format response with essential payment information
    const paymentDetails = {
      id: session.id,
      payment_status: session.payment_status,
      status: session.status,
      amount_total: session.amount_total,
      amount_subtotal: session.amount_subtotal,
      currency: session.currency,
      customer_details: {
        email: session.customer_details?.email || session.customer_email,
        name: session.customer_details?.name,
        phone: session.customer_details?.phone,
        address: session.customer_details?.address,
      },
      shipping_details: session.shipping_details,
      payment_intent: session.payment_intent?.id,
      invoice: session.invoice,
      metadata: session.metadata,
      created: session.created,
    };

    return res.status(200).json(paymentDetails);
  } catch (error) {
    console.error('Error retrieving payment details:', error);
    
    // Return user-friendly error messages
    if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({ 
        error: 'Invalid session ID',
        message: error.message 
      });
    } else {
      return res.status(500).json({ 
        error: 'Failed to retrieve payment details',
        message: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred while fetching payment information.'
      });
    }
  }
}

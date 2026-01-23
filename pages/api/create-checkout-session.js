const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Professional Stripe Checkout Session Handler
 * Creates a secure payment session for e-commerce transactions
 */
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }




  
  try {
    const { body } = req;

    // Validate required fields
    if (!body.cartList || !Array.isArray(body.cartList) || body.cartList.length === 0) {
      return res.status(400).json({ error: 'Cart list is required and must not be empty' });
    }

    if (!body.orderno) {
      return res.status(400).json({ error: 'Order number is required' });
    }

    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    // Validate Stripe secret key
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('Stripe secret key is not configured');
      return res.status(500).json({ error: 'Payment service configuration error' });
    }

    // Calculate line items with proper pricing
    const lineItems = body.cartList.map((item) => {
      // Calculate unit price (total price divided by quantity)
      // If item has individual price, use that; otherwise calculate from total
      const unitPrice = item.price || item.salePrice || (body.totalPrice / body.cartList.reduce((sum, i) => sum + (i.qty || 1), 0));
      
      // Ensure unit price is valid
      const validUnitPrice = Math.max(0, Math.round(unitPrice * 100)); // Convert to cents

      return {
        price_data: {
          currency: 'eur', // Use lowercase ISO currency code
          product_data: {
            name: item.name || 'Product',
            description: item.description || undefined,
            images: item.image ? [item.image] : undefined,
            metadata: {
              sku: item.sku || '',
              product_id: item.id || '',
              variant: item.variant ? JSON.stringify(item.variant) : undefined,
            },
          },
          unit_amount: validUnitPrice,
        },
        quantity: item.qty || 1,
        adjustable_quantity: {
          enabled: false,
        },
      };
    });

    // Add shipping as a line item if delivery fee exists
    if (body.deliveryFee && body.deliveryFee > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Shipping Charges',
            description: 'Standard Shipping',
          },
          unit_amount: Math.round(body.deliveryFee * 100), // Convert to cents
        },
        quantity: 1,
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      
      // Customer information
      customer_email: body.email,
      billing_address_collection: 'auto',
      phone_number_collection: {
        enabled: true,
      },

      // Line items
      line_items: lineItems,

      // Shipping options (if not included as line item)
      ...(body.deliveryFee && body.deliveryFee > 0 && !lineItems.find(item => item.price_data.product_data.name === 'Shipping Charges') ? {
        shipping_options: [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: {
                amount: Math.round(body.deliveryFee * 100),
                currency: 'eur',
              },
              display_name: 'Standard Shipping',
            },
          },
        ],
      } : {}),

      // Invoice settings
      invoice_creation: {
        enabled: true,
      },

      // Consent collection - commented out until Terms of Service URL is set in Stripe Dashboard
      // To enable: Set Terms of Service URL in Stripe Dashboard at https://dashboard.stripe.com/settings/public
      // Then uncomment the following:
      // consent_collection: {
      //   terms_of_service: 'required',
      // },

      // Success and cancel URLs
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}&orderno=${encodeURIComponent(body.orderno)}`,
      cancel_url: `${req.headers.origin}/cancelpayment?session_id={CHECKOUT_SESSION_ID}&orderno=${encodeURIComponent(body.orderno)}`,

      // Metadata for order tracking
      metadata: {
        order_number: body.orderno,
        customer_email: body.email,
      },

      // Payment intent data (optional, for additional metadata)
      payment_intent_data: {
        metadata: {
          order_number: body.orderno,
        },
      },
    });

    // Return session URL
    return res.status(200).json({ 
      url: session.url,
      sessionId: session.id 
    });

  } catch (err) {
    console.error('Stripe checkout session error:', err);
    
    // Return user-friendly error messages
    if (err.type === 'StripeCardError') {
      return res.status(400).json({ 
        error: 'Card payment failed',
        message: err.message 
      });
    } else if (err.type === 'StripeInvalidRequestError') {
      return res.status(400).json({ 
        error: 'Invalid payment request',
        message: err.message 
      });
    } else {
      return res.status(err.statusCode || 500).json({ 
        error: 'Payment processing error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred while processing your payment. Please try again.'
      });
    }
  }
}

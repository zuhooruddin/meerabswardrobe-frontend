# Stripe Payment Integration Setup Guide

## Overview
This project uses Stripe for secure payment processing. The integration supports credit/debit card payments with proper error handling and security best practices.

## Environment Variables

### Required Variables

Add the following to your `.env.local` file (create it if it doesn't exist):

```bash
# Stripe Publishable Key (Public - Safe for frontend)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51KnhBzDS7B2E2vgJoKHw2iJDYJsanTjB0LGge8Ltg9vCE6Jef7AS48QZ5whPcmNiAmPMUjJwMz1gJYeQHU37EjSU00fD3beazu

# Stripe Secret Key (Private - Server-side only)
STRIPE_SECRET_KEY=sk_test_51KnhBzDS7B2E2vgJoaaxoVUlt6E4Glry74E5Y9bGTkaAPpT4jGr8mCmU5sbH013ST9Ylq6Whv9MG9xVDqjRRPJdo00NA1T5F2b
```

### Important Notes

1. **Never commit `.env.local` to git** - It's already in `.gitignore`
2. **Use test keys for development** - Keys starting with `pk_test_` and `sk_test_`
3. **Use live keys for production** - Keys starting with `pk_live_` and `sk_live_`
4. **Secret key is server-side only** - Never expose `STRIPE_SECRET_KEY` in frontend code

## Current Configuration

### Test Keys (Development)
- **Publishable Key:** `pk_test_51KnhBzDS7B2E2vgJoKHw2iJDYJsanTjB0LGge8Ltg9vCE6Jef7AS48QZ5whPcmNiAmPMUjJwMz1gJYeQHU37EjSU00fD3beazu`
- **Secret Key:** `sk_test_51KnhBzDS7B2E2vgJoaaxoVUlt6E4Glry74E5Y9bGTkaAPpT4jGr8mCmU5sbH013ST9Ylq6Whv9MG9xVDqjRRPJdo00NA1T5F2b`

## Features

### Payment Methods
- ✅ Credit/Debit Cards (Visa, Mastercard, Amex, etc.)
- ✅ Secure payment processing via Stripe Checkout
- ✅ Invoice generation
- ✅ Payment status tracking

### Security Features
- ✅ Server-side payment processing
- ✅ PCI compliance (handled by Stripe)
- ✅ Secure token-based authentication
- ✅ Input validation and sanitization
- ✅ Error handling with user-friendly messages

### Payment Flow
1. Customer adds items to cart
2. Customer proceeds to checkout
3. Customer selects "Pay with Credit/Debit Card"
4. Order is created in database (UNCONFIRMED status)
5. Stripe checkout session is created
6. Customer is redirected to Stripe payment page
7. Payment is processed securely
8. Customer is redirected to success/cancel page
9. Payment status is updated in database

## API Endpoints

### Create Checkout Session
- **Endpoint:** `POST /api/create-checkout-session`
- **Purpose:** Creates a Stripe checkout session for payment
- **Request Body:**
  ```json
  {
    "cartList": [
      {
        "id": "product-id",
        "name": "Product Name",
        "price": 29.99,
        "qty": 2,
        "image": "https://example.com/image.jpg",
        "sku": "PROD-001"
      }
    ],
    "orderno": "ORD-12345",
    "totalPrice": 59.98,
    "deliveryFee": 5.00,
    "email": "customer@example.com"
  }
  ```

### Get Payment Details
- **Endpoint:** `GET /api/get-payment-details?session_id={session_id}`
- **Purpose:** Retrieves payment details after checkout
- **Response:**
  ```json
  {
    "id": "cs_test_...",
    "payment_status": "paid",
    "amount_total": 6498,
    "currency": "eur",
    "customer_details": {
      "email": "customer@example.com",
      "name": "John Doe"
    },
    "invoice": "in_..."
  }
  ```

## Testing

### Test Cards
Use these test card numbers in Stripe test mode:

- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **Requires Authentication:** `4000 0025 0000 3155`

Use any future expiry date, any 3-digit CVC, and any ZIP code.

### Test Scenarios
1. **Successful Payment**
   - Use card: `4242 4242 4242 4242`
   - Should redirect to success page
   - Order status should update to CONFIRMED

2. **Failed Payment**
   - Use card: `4000 0000 0000 0002`
   - Should show error message
   - Order remains UNCONFIRMED

3. **3D Secure Authentication**
   - Use card: `4000 0025 0000 3155`
   - Should prompt for authentication
   - Complete authentication to proceed

## Currency Configuration

Currently configured for **EUR (Euro)**. To change currency:

1. Update `currency: 'eur'` in `/pages/api/create-checkout-session.js`
2. Ensure all price calculations use the same currency
3. Update currency display in frontend components

## Production Deployment

### Before Going Live

1. **Get Live Keys**
   - Log in to Stripe Dashboard
   - Switch to "Live mode"
   - Copy live publishable and secret keys

2. **Update Environment Variables**
   - Set `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to live key
   - Set `STRIPE_SECRET_KEY` to live secret key
   - Update in your hosting platform (Vercel, AWS, etc.)

3. **Webhook Configuration** (Optional but Recommended)
   - Set up webhook endpoint in Stripe Dashboard
   - Handle payment events (payment_intent.succeeded, etc.)
   - Update order status automatically

4. **Test in Production**
   - Use real card with small amount
   - Verify payment flow works correctly
   - Check invoice generation

## Troubleshooting

### Common Issues

1. **"Stripe secret key is not configured"**
   - Check `.env.local` file exists
   - Verify `STRIPE_SECRET_KEY` is set
   - Restart development server after adding env variables

2. **"Invalid API Key"**
   - Verify key format (starts with `sk_test_` or `sk_live_`)
   - Check for extra spaces or characters
   - Ensure you're using correct mode (test vs live)

3. **Payment fails silently**
   - Check browser console for errors
   - Verify Stripe dashboard for declined payments
   - Check network tab for API errors

4. **Currency mismatch**
   - Ensure all prices use same currency
   - Check currency code is lowercase (e.g., 'eur' not 'EUR')

## Support

For Stripe-related issues:
- Stripe Documentation: https://stripe.com/docs
- Stripe Support: https://support.stripe.com
- Stripe Dashboard: https://dashboard.stripe.com

For integration issues:
- Check API logs in server console
- Review error messages in browser console
- Verify environment variables are set correctly

## Security Best Practices

1. ✅ Never commit secret keys to git
2. ✅ Use environment variables for all sensitive data
3. ✅ Validate all input on server-side
4. ✅ Use HTTPS in production
5. ✅ Implement rate limiting (recommended)
6. ✅ Log payment events for audit trail
7. ✅ Handle errors gracefully without exposing sensitive info

---

**Last Updated:** 2024  
**Stripe API Version:** Latest  
**Integration Status:** ✅ Production Ready


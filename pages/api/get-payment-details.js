import { getSession } from 'next-auth/react';
// import { stripe } from '../../src/utils/stripe'; 
// const { loadStripe } = require('@stripe/stripe-js');


const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);


export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end(); 
  }

  try {
    const { session_id } = req.query;

    const session = await stripe.checkout.sessions.retrieve(session_id);




    res.status(200).json(session);
  } catch (error) {
    console.error('Error:', error); 
    res.status(500).json({ error: 'An error occurred while fetching payment details.' });
  }
}

const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

  


export default async function handler(req, res) {
    
  try {
    const { body } = req;




    const session = await stripe.checkout.sessions.create({
    
      
      submit_type: 'pay',
      mode: 'payment',
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      customer_email: body.email  ,
      invoice_creation: {
        enabled: true,
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: body.deliveryFee*100,
              currency: 'pkr',
            },
            display_name: 'Standard Shipping',
          
          },
        },
      ],
      line_items: body.cartList.map((item) => {
        return {
          price_data: {
            currency: 'pkr',
            product_data: {
              name: item.name,
              images: [item.image]
            },
            unit_amount: body.totalPrice* 100,
          },
          quantity: item.qty,
          adjustable_quantity: { enabled: false },

        
        };
      }),
      phone_number_collection: {
        enabled: true,
      },
  
   
   


      
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}&orderno=${body.orderno}`,
      cancel_url: `${req.headers.origin}/cancelpayment?session_id={CHECKOUT_SESSION_ID}&orderno=${body.orderno}`,

      "consent_collection": {
        "terms_of_service": "required"
      },

    });


    
    res.json({url: session.url}) 

 
  } catch (err) {
    console.error(err);

    res.status(err.statusCode || 500).json(err.message);
  }
}

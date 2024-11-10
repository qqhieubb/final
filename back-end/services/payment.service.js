import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_KEY);
let SESSION_ID = ""


class PaymentService {
  createCheckout = async (data) => {
    try {
      // Step 1: Create a new customer in Stripe
      const customer = await stripe.customers.create({
        metadata: {
          user_id: data.userId,
        },
      });

      // Step 2: Prepare line items for each course
      const lineItems = data.courses.map(course => ({
        price_data: {
          currency: 'vnd', // Currency type
          product_data: {
            name: "Food 01", // Product name
          },
          unit_amount: course.price * 100, // Price in cents (multiply by 100)
        },
        quantity: course.amount || 1, // Quantity of items (default to 1 if not specified)
      }));

      // Step 3: Create a checkout session for payment
      const session = await stripe.checkout.sessions.create({
        customer: customer.id, // Attach the customer to the session
        payment_method_types: ['card'], // Payment methods, e.g., card
        line_items: lineItems, // Add the array of line items for multiple courses
        mode: 'payment', // Mode of payment, e.g., 'payment' or 'subscription'
        shipping_address_collection: {
          allowed_countries: ['VN'],
        },
        success_url: `http://localhost:5000/api/register-courses/${data.orderId}`, // Redirect URL for success
        // success_url: `http://127.0.0.1:5500/public/test.html`, // Redirect URL for success
        cancel_url: 'http://127.0.0.1:5500/public/failure.html', // Redirect URL for cancellation
      });

      SESSION_ID = session.id
      return {
        status: 'success',
        url: session.url,
        session
      };
    } catch (error) {
      // Error handling
      console.error('Error creating checkout session:', error);
      return {
        status: 500,
        message: 'Failed to create checkout session',
      };
    }
  };

  listenCheckout = async () => {
    const result = Promise.all([
      stripe.checkout.sessions.retrieve(SESSION_ID, { expand: ['payment_intent.payment_method'] }),
      stripe.checkout.sessions.listLineItems(SESSION_ID)
    ])

    return result;
  }
}

export default new PaymentService();

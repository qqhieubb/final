import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_KEY);
let SESSION_ID = ""


class PaymentService {
  createCheckout = async (data) => {
    try {
      // Bước 1: Tạo một khách hàng mới trên Stripe
      const customer = await stripe.customers.create({
        metadata: {
          user_id: data.userId,
        },
      });
  
      // Bước 2: Chuẩn bị line items
      const lineItems = data.courses.map(course => ({
        price_data: {
          currency: 'VND', // Đơn vị tiền tệ là VND
          product_data: {
            name: course.title, // Tên khóa học
          },
          unit_amount: course.price, // Giá tiền trực tiếp (1.000.000 VND)
        },
        quantity: course.amount || 1, // Số lượng (mặc định là 1)
      }));
  
      // Bước 3: Tạo checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customer.id, // ID khách hàng
        payment_method_types: ['card'], // Phương thức thanh toán
        line_items: lineItems, // Danh sách sản phẩm
        mode: 'payment', // Chế độ thanh toán một lần
        shipping_address_collection: {
          allowed_countries: ['VN'], // Chỉ cho phép địa chỉ tại Việt Nam
        },
        success_url: `http://localhost:5000/api/register-courses/${data.orderId}`,
        cancel_url: 'http://127.0.0.1:5500/public/failure.html',
      });
  
      SESSION_ID = session.id;
      return {
        status: 'success',
        url: session.url,
        session,
      };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      return {
        status: 500,
        message: 'Failed to create checkout session',
        error,
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

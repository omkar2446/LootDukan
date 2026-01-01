import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!
});

export async function POST(req: Request) {
  try {
    const { productId, amount } = await req.json();
    
    // Validate user authentication
    const userId = await getCurrentUserId(); // Implement this based on your auth
    
    // Create order
    const order = await razorpay.orders.create({
      amount: amount, // amount in paise
      currency: 'INR',
      receipt: `premium_${productId}_${Date.now()}`,
      notes: {
        productId,
        userId,
        type: 'premium_upgrade'
      }
    });

    return Response.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
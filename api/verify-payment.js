import crypto from 'crypto';
import { supabase } from '@/lib/supabase'; // Your Supabase client

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      productId
    } = body;

    // Verify signature
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpay_signature) {
      return Response.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Update product to premium in database
    const { error } = await supabase
      .from('products')
      .update({ 
        is_premium: true,
        premium_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      })
      .eq('id', productId);

    if (error) throw error;

    // Save payment record
    await supabase
      .from('premium_payments')
      .insert({
        user_id: userId,
        product_id: productId,
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        amount: 19900, // ₹199 in paise
        status: 'completed'
      });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
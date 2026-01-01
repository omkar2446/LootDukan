// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "@supabase/supabase-js";
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

serve(async (req: Request) => {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      product,
      seller_id,
    } = body as any;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return new Response(JSON.stringify({ error: "Missing payment fields" }), { status: 400 });
    }

    const secret = Deno.env.get("RAZORPAY_KEY_SECRET")!;
    const shasum = createHmac("sha256", secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");

    if (digest !== razorpay_signature) {
      return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400 });
    }

    // Insert product into Supabase using service role key
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const sb = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const insertPayload: any = {
      seller_id: seller_id,
      product_name: product.product_name,
      description: product.description || null,
      original_price: product.original_price,
      discount_price: product.discount_price,
      image1: product.image1 || null,
      image2: product.image2 || null,
      image3: product.image3 || null,
      status: "approved",
    };

    const { error: insertError } = await sb.from("products").insert(insertPayload);

    if (insertError) {
      console.error("insert product error", insertError);
      return new Response(JSON.stringify({ error: insertError.message }), { status: 500 });
    }

    // Optionally record payment (if table exists)
    try {
      await sb.from("payments").insert({
        seller_id: seller_id,
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        amount: product.amount || 5000,
        status: "completed",
      });
    } catch (e) {
      // Non-fatal if payments table doesn't exist
      console.warn("payments insert failed (non-fatal)", e);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("verify-payment error", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
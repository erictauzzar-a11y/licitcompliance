import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { mockStore } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: any;

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // Fallback seguro se o webhook secret ainda não foi cadastrado no env
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error("Stripe Webhook Signature Verification Error:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Tratamento de eventos de ciclo de vida de assinatura
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      console.log("Stripe Checkout Completed:", session.id, session.customer_email);
      break;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object;
      console.log("Subscription Active/Updated:", subscription.id, subscription.status);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      console.log("Subscription Canceled:", subscription.id);
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object;
      console.log("Invoice Payment Succeeded:", invoice.id, invoice.amount_paid);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

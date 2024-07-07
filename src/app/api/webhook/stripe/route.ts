import stripe from "@/app/lib/stripe";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const prisma = new PrismaClient();

const webhookSecret = process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET as string;

const handleAccountUpdated = async (event: Stripe.Event) => {};

export async function POST(request: any) {
  try {
    console.log("request receivedddd, webhookSecret");
    const body = await request.text();
    const sig = request.headers.get("stripe-signature") as string;
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
      console.log("webhook secret", webhookSecret);
      console.log(`⚠️ Webhook signature verification failed.`, err.message);
      return new Response(`Webhook Error: ${err}`, {
        status: 400,
      });
    }
    // Handle the event
    switch (event.type) {
      case "account.updated":
        await handleAccountUpdated(event);
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    return NextResponse.json(
      { message: "Something went wrong", err: JSON.stringify(err) },
      { status: 400 }
    );
  }
}

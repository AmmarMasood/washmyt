import stripe from "@/app/lib/stripe";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const prisma = new PrismaClient();

const webhookSecret = process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET as string;

const handleAccountUpdated = async (event: Stripe.Event) => {
  const eventAccountUpdated = event as Stripe.AccountUpdatedEvent;
  // get the account ID from the event
  const accountID = eventAccountUpdated.account as string;
  // get the account data from db
  const user = await prisma.userProfile.findUnique({
    where: {
      stripeAccountId: accountID,
    } as any,
  });
  if (!user) {
    console.log("User not found");
    return;
  }
  // update the account data
  await prisma.userProfile.update({
    where: {
      stripeAccountId: accountID,
    } as any,
    data: {
      chargesEnabled: eventAccountUpdated.data.object.charges_enabled,
      transfersEnabled: eventAccountUpdated.data.object.charges_enabled,
      stripeDetailsSubmitted: eventAccountUpdated.data.object.details_submitted,
    },
  });
  console.log("Account Updated was successful!", eventAccountUpdated);
};

export async function POST(request: any) {
  try {
    console.log("request receivedddd, webhookSecret", webhookSecret);
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
        handleAccountUpdated(event);
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    return NextResponse.json(
      { message: "Something went wrong", err: err },
      { status: 400 }
    );
  }
}

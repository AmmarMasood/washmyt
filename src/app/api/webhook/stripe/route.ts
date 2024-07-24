import stripe from "@/app/lib/stripe";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const prisma = new PrismaClient();

const webhookSecret = process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET as string;

const handleAccountUpdated = async (event: Stripe.Event) => {
  const account = event.data.object as Stripe.Account;

  if (!account.id) {
    console.error("No account ID found in the event data");
    return;
  }

  try {
    const user = await prisma.userProfile.findFirst({
      where: {
        stripeAccountId: account.id,
      },
    });
    if (!user) throw new Error("User not found");
    console.log("user found", user.id);
    const updatedUser = await prisma.userProfile.update({
      where: {
        id: user.id,
      },
      data: {
        chargesEnabled: account.charges_enabled || false,
        transfersEnabled: account.payouts_enabled || false, // Stripe uses 'payouts_enabled' for transfers
        stripeDetailsSubmitted: account.details_submitted || false,
      },
    });

    console.log(`User updated: ${updatedUser.id}`);
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

export async function POST(request: any) {
  try {
    console.log("request received, webhookSecret");
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

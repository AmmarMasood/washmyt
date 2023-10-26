import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import stripe from "@/app/lib/stripe";

export async function POST(request: any) {
  const res = await request.json();
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "USD",
      amount: res.amount,
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 400 }
    );
  }
}

import stripe from "@/app/lib/stripe";
import { sendSms } from "@/app/lib/twilio";
import { washerCut } from "@/contants";
import { PrismaClient, WashStatus } from "@prisma/client";
import { message } from "antd";
import { NextResponse } from "next/server";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export async function GET(request: any) {
  const userId = request.headers.get("userId");
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  try {
    const washRequest = await prisma.washRequest.findUnique({
      where: {
        id: id as string,
        washerId: userId,
      },
    });

    if (!washRequest) {
      throw new Error("Wash request not found");
    }

    const customer = await prisma.customer.findUnique({
      where: {
        id: washRequest.customerId,
      },
    });

    if (!customer) {
      throw new Error("Customer not found");
    }

    const washer = await prisma.userProfile.findUnique({
      where: {
        userId: washRequest.washerId || "",
      },
    });

    if (!washer) {
      throw new Error("Washer not found");
    }

    if (!washer.stripeAccountId) {
      throw new Error("Stripe account not found");
    }

    if (!washRequest.chargedAmount) {
      throw new Error("Charged amount not found");
    }

    const ledger = await prisma.washRequestLedger.findUnique({
      where: {
        washRequestId: washRequest.id,
      },
    });

    if (!ledger) {
      throw new Error("Ledger not found");
    }

    const washerCu = Math.round(ledger.receivedAmount * washerCut);
    const newReceivedAmount = ledger.receivedAmount - washerCu;

    const updatedWashRequest = await prisma.washRequest.update({
      where: {
        id: id as string,
        washerId: userId,
      },
      data: {
        washStatus: WashStatus.COMPLETED,
        washCompletedTime: new Date(),
      },
    });

    // add amount to ledger
    await prisma.washRequestLedger.update({
      where: {
        id: ledger.id,
      },
      data: {
        receivedAmount: newReceivedAmount,
        washerCharges: washerCu,
      },
    });

    await stripe.transfers.create({
      amount: washerCu, //convert to cents
      currency: "usd",
      destination: washer.stripeAccountId,
    });

    await sendSms(
      customer.phoneNumber, //set customer number here right now im using min only
      `Hi ${customer.name}, your wash request have been completed, please give your feedback below:\nhttps://washmyt.vercel.app/wash-request/detail/${washRequest.id}.\n\n- WashMyT Team`
    );

    return NextResponse.json({ ...updatedWashRequest });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 400 }
    );
  }
}

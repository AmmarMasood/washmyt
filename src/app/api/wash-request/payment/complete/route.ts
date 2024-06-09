import { sendSms } from "@/app/lib/twilio";
import { stripeCharges } from "@/contants";
import { PaymentStatus, PrismaClient, WashStatus } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(request: any) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const res = await request.json();

  if (!res.stripeId && !res.chargedAmount) {
    return NextResponse.json(
      { message: "Missing some fields" },
      { status: 400 }
    );
  }

  try {
    const r = await prisma.washRequest.update({
      where: {
        id: id as string,
      },
      data: {
        paymentStatus: PaymentStatus.PAID,
        stripeId: res.stripeId,
        chargedAmount: res.chargedAmount,
        couponId: res.couponId ? res.couponId : null,
      },
    });

    const customer = await prisma.customer.findUnique({
      where: {
        id: r.customerId,
      },
    });

    const washer = await prisma.userProfile.findUnique({
      where: {
        userId: r.washerId || "",
      },
    });

    const chargedAmount = res.chargedAmount;
    const stripeCharge = Math.round(res.chargedAmount * stripeCharges);
    const receivedAmount = chargedAmount - stripeCharge;
    // add amount to ledger
    await prisma.washRequestLedger.create({
      data: {
        chargedAmount: res.chargedAmount,
        washRequestId: r.id,
        stripeCharges: stripeCharge,
        receivedAmount: receivedAmount,
      },
    });

    if (!customer) {
      throw new Error("Customer not found");
    }

    if (!washer) {
      throw new Error("Washer not assigned");
    }

    await sendSms(
      customer.phoneNumber, //set customer number here later, rightnow hardcoding mine
      `Hi ${customer.name}, great news! \n\nWe have received payment for your request.\n\nThanks for the confirmation!\n\nOnce the was is complete you can rate your wash experience here:\nhttps://app.washmyt.com/wash-request/detail/${r.id} \n\n- WashMyT Team`
    );

    await sendSms(
      washer.phoneNumber || "", //set customer number here later, rightnow hardcoding mine
      `Hi ${washer.name}, great news! \n\ ${customer.name} has completed the payment, please use the following link to document the wash when you are ready to begin:\n\n\nhttps://app.washmyt.com/user/wash-detail/${r.id} \n\n- WashMyT Team`
    );

    return NextResponse.json({ ...r });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 400 }
    );
  }
}

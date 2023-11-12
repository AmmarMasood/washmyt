import { sendSms } from "@/app/lib/twilio";
import { PaymentStatus, PrismaClient, WashStatus } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(request: any) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const res = await request.json();

  if (!res.rating) {
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
        rating: res.rating,
        tipPaid: res.tipPaid === true ? true : false,
        tipAmount: res.tipPaid === true ? res.tipAmount : null,
        tipStripeId: res.tipPaid === true ? res.tipStripeId : null,
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

    if (!customer) {
      throw new Error("Customer not found");
    }

    if (!washer) {
      throw new Error("Washer not assigned");
    }

    await sendSms(
      washer.phoneNumber as string, //set customer number here later, rightnow hardcoding mine
      `Hi ${washer.name}, \n\nWash request have been reviewed by the customer.\n\n\nhttps://washmyt.vercel.app/user/wash-detail/${r.id} \n\n- WashMyT Team`
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

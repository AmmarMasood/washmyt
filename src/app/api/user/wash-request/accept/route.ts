import { sendSms } from "@/app/lib/twilio";
import { PrismaClient, WashStatus } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: any) {
  const userId = request.headers.get("userId");
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  try {
    const r = await prisma.washRequest.update({
      where: {
        id: id as string,
        washStatus: WashStatus.CREATED,
      },
      data: {
        washStatus: WashStatus.ACCEPTED,
        washerId: userId,
      },
    });

    const customer = await prisma.customer.findUnique({
      where: {
        id: r.customerId,
      },
    });

    if (!customer) {
      throw new Error("Customer not found");
    }

    await sendSms(
      `whatsapp:+923327317911`, //set customer number here right now im using min only
      `Hi ${customer.name}, good news! We've matched your wash request with a pro from our network.\n\nTo confirm and schedule your wash, please make a payment within the next 24 hours via this link:\nhttps://washmyt.vercel.app/wash-request/payment?wash=${r.id}.\n\n- WashMyT Team`
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

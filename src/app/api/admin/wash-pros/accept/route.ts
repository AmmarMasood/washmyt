import { sendSms } from "@/app/lib/twilio";
import { PrismaClient, Role, WashStatus } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: any) {
  const userId = request.headers.get("userId");
  const body = await request.json();

  if (!userId) {
    return NextResponse.json(
      { message: "User id is required" },
      { status: 400 }
    );
  }
  const user = await prisma.userProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!user || user.role !== Role.ADMIN) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const r = await prisma.washRequest.update({
      where: {
        id: body.washId as string,
      },
      data: {
        washStatus: WashStatus.ACCEPTED,
        washerId: body.washerId,
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
      customer.phoneNumber, //set customer number here right now im using min only
      `Hi ${customer.name}, good news! We've matched your wash request with a pro from our network.\n\nTo confirm and schedule your wash, please make a payment within the next 24 hours via this link:\nhttps://app.washmyt.com/wash-request/payment?wash=${r.id}.\n\n- WashMyT Team`
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

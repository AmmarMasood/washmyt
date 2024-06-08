import { sendSms } from "@/app/lib/twilio";
import { PrismaClient, WashStatus } from "@prisma/client";
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

  console.log("userId", userId, id);
  try {
    const r = await prisma.washRequest.update({
      where: {
        id: id as string,
        washerId: userId,
      },
      data: {
        washStatus: WashStatus.STARTED,
        washStartedTime: new Date(),
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
      `Hi ${customer.name}, your wash request have been started, you can check the status here:\nhttps://washmyt.vercel.app/wash-request/detail/${r.id}.\n\n- WashMyT Team`
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

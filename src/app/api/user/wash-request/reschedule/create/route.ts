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

export async function POST(request: any) {
  const body = await request.json();
  const userId = request.headers.get("userId");
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  try {
    const washRequest = await prisma.washRequest.findUnique({
      where: {
        id: id as string,
      },
    });

    if (!washRequest) {
      throw new Error("Wash Request not found");
    }

    if (washRequest.washStatus === WashStatus.ACCEPTED) {
      throw new Error("Wash Request already accepted");
    }

    const oldRescheduleRequest = await prisma.rescheduleRequest.findFirst({
      where: {
        washRequestId: id as string,
        generatedBy: userId,
      },
    });

    if (oldRescheduleRequest) {
      throw new Error("Reschedule Request already sent");
    }

    const rescheduleRequest = await prisma.rescheduleRequest.create({
      data: {
        washRequestId: id as string,
        generatedBy: userId,
        rescheduleDateAndTimeUTC: body.rescheduleDateAndTimeUTC,
      },
    });

    return NextResponse.json({ ...rescheduleRequest });
  } catch (err: any) {
    console.log(err.message);
    return NextResponse.json(
      {
        message: err?.message || "Something went wrong",
        err: err,
      },
      { status: 400 }
    );
  }
}

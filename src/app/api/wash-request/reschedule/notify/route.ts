import { sendSms } from "@/app/lib/twilio";
import { PaymentStatus } from "@/app/types/interface";
import {
  PrismaClient,
  RescheduleRequestStatus,
  WashStatus,
} from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export async function GET(request: any) {
  const url = new URL(request.url);
  const id = url.searchParams.get("secretKey");

  if (id !== "6489690879") {
    return NextResponse.json(
      { message: "Invalid secret key" },
      { status: 400 }
    );
  }

  try {
    // if wasj request is already accepted
    const rRequest = await prisma.rescheduleRequest.findMany({
      where: {
        status: RescheduleRequestStatus.PENDING,
      },
      include: {
        washRequest: {
          include: {
            customer: true,
          },
        },
        generatedByUser: true,
      },
    });

    const currentDate = new Date();
    //requests whos washStatus is created and its been more than 24 hours since the washRequest was created
    const requestsToBeNotified = rRequest.filter(
      (r) => r.washRequest.washStatus === WashStatus.CREATED
    );
    //   .filter((r) => {
    //     const washRequestDate = new Date(r.washRequest.createdAt);
    //     const diff = currentDate.getTime() - washRequestDate.getTime();
    //     const diffHours = diff / (1000 * 3600);
    //     return diffHours > 24;
    //   });

    for (let i = 0; i < requestsToBeNotified.length; i++) {
      sendSms(
        requestsToBeNotified[i].washRequest.customer.phoneNumber,
        `Hey ${requestsToBeNotified[i].washRequest.customer.name}, unfortunately we didn't have a wash pro at the time you requested. We did find available wash pros for you - if you'd like to secure that time slot, please accept the reschedule request on this link:\nhttps://washmyt.vercel.app/wash-request/reschedule/${requestsToBeNotified[i].id}.\n\n- WashMyT Team`
      );
    }

    await prisma.rescheduleRequest.updateMany({
      where: {
        id: {
          in: requestsToBeNotified.map((r) => r.id),
        },
      },
      data: {
        status: RescheduleRequestStatus.NOTIFIED,
      },
    });

    return NextResponse.json({ message: "success", requestsToBeNotified });
  } catch (err: any) {
    console.log(err);
    return NextResponse.json(
      { message: err?.message || "Something went wrong", err: err },
      { status: 400 }
    );
  }
}

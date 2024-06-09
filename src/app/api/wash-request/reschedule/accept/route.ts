import { sendSms } from "@/app/lib/twilio";
import { PaymentStatus } from "@/app/types/interface";
import {
  PrismaClient,
  RescheduleRequestStatus,
  WashStatus,
} from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: any) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  try {
    // if wasj request is already accepted
    const rRequest = await prisma.rescheduleRequest.findUnique({
      where: {
        id: id as string,
      },
      include: {
        washRequest: true,
        generatedByUser: true,
      },
    });

    if (rRequest?.status === RescheduleRequestStatus.DISCARDED) {
      return NextResponse.json(
        { message: "Reschedule request is  discarded" },
        { status: 400 }
      );
    }

    if (rRequest?.status === RescheduleRequestStatus.ACCEPTED) {
      return NextResponse.json(
        { message: "Reschedule request is already accepted" },
        { status: 400 }
      );
    }

    if (rRequest?.status === RescheduleRequestStatus.REJECTED) {
      return NextResponse.json(
        { message: "Reschedule request is already rejected" },
        { status: 400 }
      );
    }

    if (rRequest?.washRequest?.washStatus === WashStatus.ACCEPTED) {
      return NextResponse.json(
        { message: "Wash request is already accepted" },
        { status: 400 }
      );
    }

    // if wash request is already completed

    if (rRequest?.washRequest?.washStatus === WashStatus.COMPLETED) {
      return NextResponse.json(
        { message: "Wash request is already completed" },
        { status: 400 }
      );
    }

    // if wash request is already cancelled

    if (rRequest?.washRequest?.washStatus === WashStatus.CANCELLED) {
      return NextResponse.json(
        { message: "Wash request is already cancelled" },
        { status: 400 }
      );
    }

    const r = await prisma.washRequest.update({
      where: {
        id: rRequest?.washRequestId as string,
        washStatus: WashStatus.CREATED,
        paymentStatus: PaymentStatus.UNPAID,
      },
      data: {
        washStatus: WashStatus.ACCEPTED,
        washerId: rRequest?.generatedBy,
        washDateAndTimeUTC: rRequest?.rescheduleDateAndTimeUTC,
      },
    });

    await prisma.rescheduleRequest.update({
      where: {
        id: rRequest?.id as string,
      },
      data: {
        status: RescheduleRequestStatus.ACCEPTED,
      },
    });
    await prisma.rescheduleRequest.updateMany({
      where: {
        washRequestId: rRequest?.washRequestId as string,
        NOT: {
          id: rRequest?.id as string,
        },
      },
      data: {
        status: RescheduleRequestStatus.DISCARDED,
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
      `Hi ${customer.name}, you've succesfully confirmed the reschedule request!.\n\nTo confirm and schedule your wash, please make a payment within the next 24 hours via this link:\nhttps://app.washmyt.com/wash-request/payment?wash=${r.id}.\n\n- WashMyT Team`
    );

    await sendSms(
      rRequest?.generatedByUser?.phoneNumber || "", //set customer number here right now im using min only
      `Hi ${rRequest?.generatedByUser?.name}, your reschedule request have been accepted, you can check the status here:\nhttps://app.washmyt.com/user/wash-detail/${r.id}.\n\n- WashMyT Team`
    );

    return NextResponse.json({ ...r });
  } catch (err: any) {
    console.log(err);
    return NextResponse.json(
      { message: err?.message || "Something went wrong", err: err },
      { status: 400 }
    );
  }
}

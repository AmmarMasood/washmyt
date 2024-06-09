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
  const userId = request.headers.get("userId");
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  try {
    // if wasj request is already accepted
    const washRequest = await prisma.washRequest.findUnique({
      where: {
        id: id as string,
      },
    });

    const washer = await prisma.userProfile.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!washer?.stripeAccountId) {
      return NextResponse.json(
        { message: "Please complete your stripe account" },
        { status: 400 }
      );
    }

    if (!washer.chargesEnabled || !washer.transfersEnabled) {
      return NextResponse.json(
        {
          message: "Please enable charges and transfers in your stripe account",
        },
        { status: 400 }
      );
    }

    if (washRequest?.washStatus === WashStatus.ACCEPTED) {
      return NextResponse.json(
        { message: "Wash request is already accepted" },
        { status: 400 }
      );
    }

    // if wash request is already completed

    if (washRequest?.washStatus === WashStatus.COMPLETED) {
      return NextResponse.json(
        { message: "Wash request is already completed" },
        { status: 400 }
      );
    }

    // if wash request is already cancelled

    if (washRequest?.washStatus === WashStatus.CANCELLED) {
      return NextResponse.json(
        { message: "Wash request is already cancelled" },
        { status: 400 }
      );
    }

    const r = await prisma.washRequest.update({
      where: {
        id: id as string,
        washStatus: WashStatus.CREATED,
        paymentStatus: PaymentStatus.UNPAID,
      },
      data: {
        washStatus: WashStatus.ACCEPTED,
        washerId: userId,
      },
    });

    await prisma.rescheduleRequest.updateMany({
      where: {
        washRequestId: r.id as string,
        status: RescheduleRequestStatus.PENDING,
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

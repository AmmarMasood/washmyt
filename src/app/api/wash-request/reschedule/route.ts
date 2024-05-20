import { sendSms } from "@/app/lib/twilio";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: any) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  try {
    const r = await prisma.rescheduleRequest.findUnique({
      where: {
        id: id as string,
      },
      include: {
        generatedByUser: true,
        washRequest: {
          include: {
            package: true,
            coupon: true,
            customer: true,
            washer: true,
          },
        },
      },
    });

    return NextResponse.json({
      ...r,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 400 }
    );
  }
}

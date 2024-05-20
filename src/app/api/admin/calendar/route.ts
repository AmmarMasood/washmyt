import {
  Customer,
  PaymentStatus,
  PrismaClient,
  Role,
  WashStatus,
} from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: any) {
  const userId = request.headers.get("userId");

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

  const washRequests = await prisma.washRequest.findMany({
    include: {
      package: true, // Include the related package data
      customer: true, // Include the related customer data
      washer: true, // Include the related washer data
    },
  });

  return NextResponse.json(washRequests);
}

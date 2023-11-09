import { PrismaClient, Role, WashStatus } from "@prisma/client";
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

  const washrequets = await prisma.washRequest.findMany({
    include: {
      coupon: true,
      customer: true,
      package: true,
      washer: true,
    },
    where: {
      washStatus: WashStatus.ACCEPTED,
    },
  });

  return NextResponse.json({
    ...washrequets,
  });
}

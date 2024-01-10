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
  try {
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

    const customers = await prisma.customer.findMany();

    return NextResponse.json({
      customers,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

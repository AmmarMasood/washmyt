import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: any) {
  const res = await request.json();
  try {
    const request = await prisma.coupon.create({
      data: {
        ...res,
      },
    });
    return NextResponse.json({
      message: "Coupon created successfully",
      requestId: request.id,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 400 }
    );
  }
}

export async function GET(request: any) {
  const url = new URL(request.url);
  const name = url.searchParams.get("name");

  try {
    const r = await prisma.coupon.findFirst({
      where: {
        name: name as string,
      },
    });

    return NextResponse.json({ ...r });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 400 }
    );
  }
}

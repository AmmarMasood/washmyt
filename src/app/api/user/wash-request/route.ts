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

  if (!userId) {
    return NextResponse.json(
      { message: "User id is required" },
      { status: 400 }
    );
  }

  const washRequests = await prisma.washRequest.findMany({
    where: {
      washerId: userId,
    },
    include: {
      package: true, // Include the related package data
      customer: true, // Include the related customer data
      washer: true, // Include the related washer data
    },
  });

  return NextResponse.json(washRequests);
}

export async function PUT(request: any) {
  const userId = request.headers.get("userId");
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const res = await request.json();

  try {
    const r = await prisma.washRequest.update({
      where: {
        id: id as string,
        washerId: userId,
      },
      data: {
        ...res,
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

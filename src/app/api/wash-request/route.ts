import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: any) {
  const res = await request.json();
  try {
    const request = await prisma.washRequest.create({
      data: {
        ...res,
      },
    });
    return NextResponse.json({
      message: "Wash request created successfully",
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
  const id = url.searchParams.get("id");

  try {
    const r = await prisma.washRequest.findUnique({
      where: {
        id: id as string,
      },
    });

    const packageInfo = await prisma.package.findUnique({
      where: {
        id: r?.packageId as string,
      },
    });

    let c = null;

    if (r?.couponId) {
      c = await prisma.coupon.findUnique({
        where: {
          id: r?.couponId as string,
        },
      });
    }

    return NextResponse.json({ ...r, package: packageInfo, couponInfo: c });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 400 }
    );
  }
}

export async function PUT(request: any) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const res = await request.json();

  try {
    const r = await prisma.washRequest.update({
      where: {
        id: id as string,
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

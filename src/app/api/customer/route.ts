import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: any) {
  const res = await request.json();
  try {
    const customer = await prisma.customer.findUnique({
      where: {
        email: res.email,
      },
    });

    if (customer) {
      const r = await prisma.customer.update({
        where: {
          id: customer.id,
        },
        data: {
          ...res,
        },
      });
      return NextResponse.json({
        message: "Customer updated successfully",
        customer: customer,
      });
    } else {
      const r = await prisma.customer.create({
        data: {
          ...res,
        },
      });
      return NextResponse.json({
        message: "Customer created successfully",
        customer: r,
      });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 400 }
    );
  }
}

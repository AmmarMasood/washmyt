import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: any) {
  try {
    console.log(
      "DATABASE NEXT_PUBLIC",
      process.env.NEXT_PUBLIC_DATABASE_URL,
      process.env.NEXT_PUBLIC_STRIPE_KEY
    );
    const options = await prisma.package.findMany();
    return NextResponse.json({ options: options });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 400 }
    );
  }
}

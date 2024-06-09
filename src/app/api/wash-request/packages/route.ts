import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: any) {
  try {
    console.log("DATABASE", process.env.NEXT_PUBLIC_DATABASE_URL);
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

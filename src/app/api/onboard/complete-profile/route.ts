import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export async function POST(request: any) {
  const res = await request.json();
  const userId = request.headers.get("userId");

  if (!userId) {
    return NextResponse.json(
      { message: "User id is required" },
      { status: 400 }
    );
  }

  const user = await prisma.userProfile.update({
    where: {
      userId,
    },
    data: {
      ...res,
    },
  });

  return NextResponse.json({ message: "User updated successfully" });
}

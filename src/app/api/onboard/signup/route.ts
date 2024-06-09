import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: any) {
  const { userId, email, photoUrl } = await request.json();

  if (!userId) {
    return NextResponse.json(
      { message: "User id is required" },
      { status: 400 }
    );
  }

  const userExists = await prisma.userProfile.findUnique({
    where: {
      userId,
    },
  });

  if (userExists) {
    return NextResponse.json({ message: "User already exist", userExists });
  }

  const user = await prisma.userProfile.create({
    data: {
      userId,
      email,
      profileImage: photoUrl,
    },
  });

  return NextResponse.json({ message: "User created successfully", user });
}

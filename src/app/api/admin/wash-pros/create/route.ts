import { PrismaClient, Role, WashStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "firebase-admin";

const prisma = new PrismaClient();

export async function POST(request: any) {
  try {
    const userId = request.headers.get("userId");
    const {
      email,
      password,
      businessName,
      name,
      phoneNumber,
      website,
      tShirtSize,
      businessAddress,
      serviceRadius,
      services,
      mobileWaterCapability,
      mobileElectricCapability,
    } = await request.json();

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

    const userExists = await prisma.userProfile.findFirst({
      where: {
        email,
      },
    });

    console.log("userExists", userExists);

    if (userExists) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    const newUser = await auth().createUser({
      email,
      password,
    });

    await prisma.userProfile.create({
      data: {
        userId: newUser.uid,
        email,
        role: Role.WASHER,
        name,
        businessName,
        phoneNumber,
        website,
        tShirtSize,
        businessAddress,
        serviceRadius,
        ownACar: true,
        mobileWaterCapability,
        mobileElectricCapability,
        services,
      },
    });

    return NextResponse.json({
      status: 200,
    });
  } catch (err) {
    console.log("errr", err);
    return NextResponse.json({
      status: 500,
    });
  }
}

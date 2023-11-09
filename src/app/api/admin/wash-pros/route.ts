import { PrismaClient, Role, WashStatus } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: any) {
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

  const users = await prisma.userProfile.findMany({
    include: {
      washRequests: true,
    },
    where: {
      userId: {
        not: userId,
      },
    },
  });

  const washRequests = await prisma.washRequest.findMany({
    where: {
      washStatus: WashStatus.COMPLETED,
    },
  });

  const onboarding = users.filter(
    (user) => user.onboardingCompleted === false
  ).length;
  const liveWashPros = users.filter(
    (user) => user.onboardingCompleted === true && user.acceptingWashes === true
  );
  const washProsLocation = liveWashPros.map(
    (user) => JSON.parse(user.businessAddress || "").geometry.location
  );

  const totalRequests = washRequests.length;
  const totalRatings = washRequests.filter(
    (wash) => wash.rating && wash.rating > 0
  ).length;

  return NextResponse.json({
    onboarding,
    liveWashPros: liveWashPros.length,
    washProsLocation,
    totalRequests,
    totalRatings,
    washPros: users,
  });
}

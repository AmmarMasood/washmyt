import {
  Customer,
  PaymentStatus,
  PrismaClient,
  Role,
  WashStatus,
} from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: any) {
  const userId = request.headers.get("userId");
  const url = new URL(request.url);
  const time = url.searchParams.get("time");

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

  try {
    const currentDate = new Date();
    const thresholdDate = new Date(currentDate);
    thresholdDate.setDate(currentDate.getDate() - parseInt(time || "0", 10));

    const washRequests = await prisma.washRequest.findMany({
      where: {
        createdAt: {
          // Filter wash requests created after the threshold date
          gte: thresholdDate,
        },
      },
      include: {
        package: true, // Include the related package data
        customer: true, // Include the related customer data
        washer: true, // Include the related washer data
      },
    });

    const washRequestWithRating = washRequests.filter(
      (w) => w.rating && w.rating > 0
    );

    const data = {
      new: washRequests.filter((req) => req.washStatus === WashStatus.CREATED)
        .length,
      cancelled: washRequests.filter(
        (req) => req.washStatus === WashStatus.CANCELLED
      ).length,
      matched: washRequests.filter(
        (req) => req.washStatus === WashStatus.ACCEPTED
      ).length,

      totalSales:
        washRequests.reduce((acc: any, req) => {
          if (
            req.paymentStatus === PaymentStatus.PAID &&
            req.washStatus === WashStatus.COMPLETED
          ) {
            return acc + req.chargedAmount + (req.tipAmount || 0);
          }
          return acc;
        }, 0) / 100,
      completed: washRequests.filter(
        (req) => req.washStatus === WashStatus.COMPLETED
      ).length,
      pending: washRequests.filter(
        (req) =>
          req.washStatus === WashStatus.ACCEPTED && !req.washCompletedTime
      ).length,
      averageRating:
        washRequestWithRating.reduce((acc: any, req) => {
          if (req.washStatus === WashStatus.COMPLETED) {
            return acc + (req.rating || 0);
          }
          return acc;
        }, 0) / washRequestWithRating.length,
      totalReviews: washRequestWithRating.length,
      washRequests,
    };

    return NextResponse.json(data);
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 400 }
    );
  }
}

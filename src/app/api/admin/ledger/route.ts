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

  const currentDate = new Date();
  const thresholdDate = new Date(currentDate);
  thresholdDate.setDate(currentDate.getDate() - parseInt(time || "0", 10));

  const washRequests = await prisma.washRequest.findMany({
    where: {
      paymentStatus: PaymentStatus.PAID,
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

  const totalWashRequests = washRequests.length;
  const totalPaymentsReceived = washRequests.reduce(
    (customerAccumulator: any, wash: any) => {
      if (
        wash.paymentStatus === PaymentStatus.PAID &&
        wash.washStatus === WashStatus.COMPLETED
      ) {
        const tipAmount = wash.tipAmount || 0;
        return customerAccumulator + wash.chargedAmount + tipAmount;
      }
      return customerAccumulator;
    },
    0
  );
  const customerCounts: any = {};

  washRequests.forEach((request) => {
    const customerId = request.customerId;
    customerCounts[customerId] = (customerCounts[customerId] || 0) + 1;
  });

  const recurrentCustomers = Object.values(customerCounts).filter(
    (count: any) => count > 1
  ).length;
  const oneTimeCustomers =
    Object.keys(customerCounts).length - recurrentCustomers;

  const percentageRecurrentCustomers =
    (recurrentCustomers / totalWashRequests) * 100;
  const percentageOneTimeCustomers =
    (oneTimeCustomers / totalWashRequests) * 100;

  return NextResponse.json({
    totalWashRequests: washRequests.filter(
      (w) => w.washStatus === WashStatus.COMPLETED
    ).length,
    totalPaymentsReceived: totalPaymentsReceived / 100,
    percentageRecurrentCustomers: percentageRecurrentCustomers.toFixed(2),
    percentageOneTimeCustomers: percentageOneTimeCustomers.toFixed(2),
    washRequests,
  });
}

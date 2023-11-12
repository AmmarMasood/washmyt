import {
  Customer,
  PaymentStatus,
  PrismaClient,
  Role,
  WashStatus,
} from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

function filterPaidAndCompletedWashes(customers: Customer[]) {
  const filteredCustomers = customers.map((customer: any) => {
    const filteredWashes = customer.washRequests.filter((wash: any) => {
      return wash.paymentStatus === "PAID" && wash.washStatus === "COMPLETED";
    });

    return {
      ...customer,
      washRequests: filteredWashes,
    };
  });

  return filteredCustomers;
}

function calculateTotalLTV(customers: any) {
  const totalLTV = customers.reduce((accumulator: any, customer: any) => {
    const customerLTV = customer.washRequests.reduce(
      (customerAccumulator: any, wash: any) => {
        if (wash.paymentStatus === "PAID" && wash.washStatus === "COMPLETED") {
          const tipAmount = wash.tipAmount || 0;
          return customerAccumulator + wash.chargedAmount + tipAmount;
        }
        return customerAccumulator;
      },
      0
    );

    return accumulator + customerLTV;
  }, 0);

  return totalLTV;
}

function calculateTotalWashValuesForRecurringPlan(customers: any) {
  const recurringPlanCustomers = customers.filter(
    (customer: any) => customer.washRequests.length >= 2
  );

  const totalWashValues = recurringPlanCustomers.reduce(
    (accumulator: any, customer: any) => {
      const customerWashValue = customer.washRequests.reduce(
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

      return accumulator + customerWashValue;
    },
    0
  );

  return totalWashValues;
}

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

  const customers = await prisma.customer.findMany({
    where: {
      createdAt: {
        // Filter wash requests created after the threshold date
        gte: thresholdDate,
      },
    },
    include: {
      washRequests: true,
    },
  });

  const allCustomers = customers;
  const totalCustomers = customers.length;
  const activeNow = customers.length;
  const customersWithCompleteWashRequests =
    filterPaidAndCompletedWashes(customers);

  return NextResponse.json({
    totalRecuringCustomersSales:
      calculateTotalWashValuesForRecurringPlan(allCustomers) / 100,
    totalCustomers,
    avgLtv: (
      calculateTotalLTV(customersWithCompleteWashRequests) /
      100 /
      customersWithCompleteWashRequests.length
    ).toFixed(2),
    customers,
  });
}

export async function DELETE(request: any) {
  const userId = request.headers.get("userId");
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

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
    const customer = await prisma.customer.delete({
      where: {
        id: id as string,
      },
    });

    return NextResponse.json(customer);
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 400 }
    );
  }
}

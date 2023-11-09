import { Customer, PrismaClient, Role, WashStatus } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

function calculateAverageLifespan(customers: Customer[]) {
  const lifespans = customers.map((customer) => {
    const createdAt = new Date(customer.createdAt);
    return Number(createdAt.getTime() / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  });

  const totalLifespan = lifespans.reduce((sum, lifespan) => sum + lifespan, 0);
  return totalLifespan / lifespans.length;
}

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

  const customers = await prisma.customer.findMany({
    include: {
      washRequests: true,
    },
  });

  const totalCustomers = customers.length;
  const activeNow = customers.length;
  const onRecurPlan = customers.filter((user) => user.washRequests.length > 2);

  const totalRevenuePerCustomer = customers.map((customer) => {
    const totalRevenue = customer.washRequests.reduce((sum, request) => {
      return sum + (request.chargedAmount || 0) + (request.tipAmount || 0);
    }, 0);
    return { customerId: customer.id, totalRevenue };
  });
  const totalRevenueSum = totalRevenuePerCustomer.reduce(
    (sum, customer) => sum + customer.totalRevenue,
    0
  );
  const arpu = totalRevenueSum / totalRevenuePerCustomer.length;
  const averageCustomerLifespan = calculateAverageLifespan(customers);
  const ltv = arpu * averageCustomerLifespan;

  return NextResponse.json({
    onRecurPlan,
    activeNow,
    totalCustomers,
    ltv,
    customers,
  });
}

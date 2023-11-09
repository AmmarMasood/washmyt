import { sendSms } from "@/app/lib/twilio";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

function haversine(lat1: any, lon1: any, lat2: any, lon2: any) {
  const R = 6371; // Earth radius in kilometers

  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

const findAndNotifyWasher = async (
  userCords: any,
  location: any,
  customerName: any,
  requestId: any
) => {
  const cords = {
    lat: userCords.lat,
    lng: userCords.lng,
  };

  // write a function that finds the nearest washer and notifies them, also check if they are available, also check if they are not already assigned to a wash request, also check their service radius lies within the user's location

  const washers = await prisma.userProfile.findMany({
    where: {
      acceptingWashes: true,
      onboardingCompleted: true,
    },
  });

  const cordsArray = washers.map((washer) => {
    return {
      id: washer.id,
      phoneNumber: washer.phoneNumber,
      email: washer.email,
      name: washer.businessName,
      serviceRadius: washer.serviceRadius || 0,
      lat: JSON.parse(washer.businessAddress || "").geometry.location.lat,
      lng: JSON.parse(washer.businessAddress || "").geometry.location.lng,
    };
  });

  const nearbyWashers: any = [];

  cordsArray.forEach((washer) => {
    const distance = haversine(cords.lat, cords.lng, washer.lat, washer.lng);
    if (distance <= washer.serviceRadius) {
      nearbyWashers.push(washer);
    }
  });

  nearbyWashers.forEach(async (washer: any) => {
    await sendSms(
      `whatsapp:+923327317911`, //set washer number here later, rightnow hardcoding mine
      `Hi ${washer.name}, great news! \n\nYou've been matched with a new wash request from ${customerName} at ${location}. \n\nPlease confirm your availability within 24 hours by accepting the request on this link:\nhttps://washmyt.vercel.app/user/wash-detail/${requestId} Thank you! \n\n- WashMyT Team`
    );
  });

  // console.log(washers, cords, cordsArray, nearbyWashers);
};

export async function POST(request: any) {
  const res = await request.json();
  try {
    const location = JSON.parse(res.address);
    const cords = location.geometry.location;

    const request = await prisma.washRequest.create({
      data: {
        ...res,
      },
    });

    const customer = await prisma.customer.findUnique({
      where: {
        id: request.customerId,
      },
    });
    if (!customer) throw new Error("Customer not found");
    await findAndNotifyWasher(
      cords,
      location.formatted_address,
      customer?.name,
      request.id
    );
    // await sendSms("+923327317911", "A Wash has been initiated by the you.");
    return NextResponse.json({
      message: "Wash request created successfully",
      requestId: request.id,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 400 }
    );
  }
}

export async function GET(request: any) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  try {
    const r = await prisma.washRequest.findUnique({
      where: {
        id: id as string,
      },
      include: {
        package: true,
        coupon: true,
        customer: true,
        washer: true,
      },
    });

    return NextResponse.json({
      ...r,
      couponInfo: r?.coupon,
      customerInfo: r?.customer,
      washerInfo: r?.washer,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 400 }
    );
  }
}

export async function PUT(request: any) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const res = await request.json();

  try {
    const r = await prisma.washRequest.update({
      where: {
        id: id as string,
      },
      data: {
        ...res,
      },
    });

    return NextResponse.json({ ...r });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 400 }
    );
  }
}

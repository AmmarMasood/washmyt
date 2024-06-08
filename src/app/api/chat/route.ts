import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { Twilio } from "twilio";
import AccessToken from "twilio/lib/jwt/AccessToken";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export async function GET(request: any) {
  const url = new URL(request.url);
  const washId = url.searchParams.get("washId");

  console.log("washId", washId);

  try {
    if (!washId) {
      return NextResponse.json(
        { message: "Wash Id is required" },
        { status: 400 }
      );
    }

    console.log("washId", washId);

    const wash = await prisma.washRequest.findUnique({
      where: {
        id: washId,
      },
    });

    console.log("wash", wash);

    if (!wash) {
      return NextResponse.json({ message: "Wash not found" }, { status: 404 });
    }
    const customer = await prisma.customer.findUnique({
      where: {
        id: wash.customerId,
      },
    });
    console.log("customer", customer);

    if (!customer) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 }
      );
    }

    const token = new AccessToken(
      process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID || "",
      process.env.NEXT_PUBLIC_TWILIO_API_KEY_SID || "",
      process.env.NEXT_PUBLIC_TWILIO_API_KEY_SECRET || "",
      { identity: customer.email, ttl: 36000 }
    );

    let grant = new AccessToken.ChatGrant({
      serviceSid: process.env.NEXT_PUBLIC_TWILLIO_CONV_SERVICE_SID,
    });
    token.addGrant(grant);
    return NextResponse.json({ token: token.toJwt() });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 400 }
    );
  }
}

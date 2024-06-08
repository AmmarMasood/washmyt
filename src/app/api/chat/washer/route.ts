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
  const userId = request.headers.get("userId");

  try {
    if (!userId) {
      return NextResponse.json(
        { message: "UserId Id is required" },
        { status: 400 }
      );
    }
    const washer = await prisma.userProfile.findUnique({
      where: {
        userId: userId,
      },
    });
    console.log("washer", washer);

    if (!washer) {
      return NextResponse.json(
        { message: "Washer not found" },
        { status: 404 }
      );
    }

    const token = new AccessToken(
      process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID || "",
      process.env.NEXT_PUBLIC_TWILIO_API_KEY_SID || "",
      process.env.NEXT_PUBLIC_TWILIO_API_KEY_SECRET || "",
      { identity: washer.email, ttl: 36000 }
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

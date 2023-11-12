// https://www.google.com/recaptcha/api/siteverifyimport { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: any) {
  const res = await request.json();
  const secretKey = process.env.NEXT_PUBLIC_GOOGLE_CAPTCHA_SECRET;
  const body = {
    secret: secretKey,
    response: res.recaptchaToken,
  };
  try {
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      new URLSearchParams(Object.entries(body)).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    if (response.data.success && response.data.score > 0.5) {
      return NextResponse.json({
        success: true,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "reCAPTCHA verification failed",
        },
        { status: 400 }
      );
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 400 }
    );
  }
}

import { NextResponse } from "next/server";
import { auth } from "firebase-admin";
import { customInitApp } from "@/app/lib/firebase-admin-config";

customInitApp();

export async function GET(request: any) {
  const token = request.headers.get("authorization");
  if (token === null || token === "null" || token === "") {
    console.log("No token");
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }
  try {
    const decodedToken = await auth().verifyIdToken(
      token.replace("Bearer ", "")
    );
    if (!decodedToken) {
      return NextResponse.json({ isLogged: false }, { status: 401 });
    }

    return NextResponse.json(
      { isLogged: true, uid: decodedToken.uid },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }
}

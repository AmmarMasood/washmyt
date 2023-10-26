import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const auth = request.headers.get("authorization");
  const responseAPI = await fetch("http://localhost:3000/api/authenticate", {
    headers: {
      authorization: auth as any,
    },
  });
  const responseAPIJson = await responseAPI.json();

  //Return to /login if token is not authorized
  if (responseAPI.status !== 200) {
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }

  return NextResponse.next({
    headers: {
      userId: (responseAPIJson as any).uid,
    },
  });
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/api/onboard/complete-profile",
    "/api/user",
    "/api/user/upload-files",
  ],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const auth = request.headers.get("authorization");
  const responseAPI = await fetch(
    "https://washmyt.vercel.app/api/authenticate",
    {
      headers: {
        authorization: auth as any,
      },
    }
  );
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
    "/api/user/wash-request",
    "/api/user/wash-request/accept",
    "/api/user/wash-request/complete",
    "/api/user/wash-request/upload-images",
    "/api/admin",
    "/api/admin/dashboard",
    "/api/admin/wash-pros",
    "/api/admin/customers",
    "/api/admin/calendar",
    "/api/admin/ledger",
    "/api/admin/wash-request",
  ],
};

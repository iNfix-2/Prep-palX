import { NextResponse, type NextRequest } from "next/server";
import {
  ACTIVE_WORKSPACE_COOKIE_NAME,
  SESSION_COOKIE_NAME,
} from "@/lib/server/auth-context";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url), { status: 303 });

  response.cookies.set(SESSION_COOKIE_NAME, "", {
    path: "/",
    maxAge: 0,
  });
  response.cookies.set(ACTIVE_WORKSPACE_COOKIE_NAME, "", {
    path: "/",
    maxAge: 0,
  });

  return response;
}

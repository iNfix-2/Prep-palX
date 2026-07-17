import { NextResponse, type NextRequest } from "next/server";
import {
  ACTIVE_WORKSPACE_COOKIE_NAME,
  SESSION_COOKIE_NAME,
  demoCookieOptions,
} from "@/lib/server/auth-context";
import { getRepositories } from "@/lib/server/repositories";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const { access } = getRepositories();
  const authenticated = access.authenticateUser(email, password);

  if (!authenticated) {
    return NextResponse.redirect(new URL("/login?error=invalid", request.url), {
      status: 303,
    });
  }

  const activeWorkspace = access.getDefaultWorkspaceForUser(authenticated.user.id);
  const response = NextResponse.redirect(new URL("/classes", request.url), { status: 303 });

  response.cookies.set(SESSION_COOKIE_NAME, authenticated.session.token, demoCookieOptions);

  if (activeWorkspace) {
    response.cookies.set(ACTIVE_WORKSPACE_COOKIE_NAME, activeWorkspace.id, demoCookieOptions);
  }

  return response;
}

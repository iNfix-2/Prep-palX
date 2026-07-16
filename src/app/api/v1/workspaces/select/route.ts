import { NextResponse, type NextRequest } from "next/server";
import { apiError } from "@/lib/server/api-response";
import {
  ACTIVE_WORKSPACE_COOKIE_NAME,
  demoCookieOptions,
  getRequestAuthContext,
} from "@/lib/server/auth-context";
import { getMembership, getWorkspace } from "@/lib/server/demo-store";

export async function POST(request: NextRequest) {
  const context = getRequestAuthContext(request);

  if (context.status === "unauthenticated") {
    return apiError("AUTH_REQUIRED", "Sign in to continue.", 401);
  }

  const body = (await request.json().catch(() => null)) as { workspaceId?: string } | null;
  const workspaceId = body?.workspaceId;

  if (!workspaceId) {
    return apiError("VALIDATION_ERROR", "Workspace ID is required.", 400, {
      workspaceId: ["Workspace ID is required."],
    });
  }

  const membership = getMembership(context.user.id, workspaceId);
  const workspace = getWorkspace(workspaceId);

  if (!membership || !workspace) {
    return apiError("FORBIDDEN", "You are not a member of this workspace.", 403);
  }

  const response = NextResponse.json({
    data: {
      activeWorkspace: {
        id: workspace.id,
        name: workspace.name,
        role: membership.roleName,
      },
    },
  });

  response.cookies.set(ACTIVE_WORKSPACE_COOKIE_NAME, workspace.id, demoCookieOptions);
  return response;
}

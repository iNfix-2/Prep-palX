import { NextResponse, type NextRequest } from "next/server";
import { apiError } from "@/lib/server/api-response";
import {
  ACTIVE_WORKSPACE_COOKIE_NAME,
  demoCookieOptions,
  getRequestAuthContext,
} from "@/lib/server/auth-context";
import { getRepositories } from "@/lib/server/repositories";
import { selectAccountWorkspace } from "@/lib/server/settings-service";

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

  const result = selectAccountWorkspace(context, workspaceId);

  if (!result.ok) {
    return apiError(result.code, result.message, result.status, result.fields);
  }

  const { access } = getRepositories();
  const workspace = access.getWorkspace(result.data.workspaceId);
  const membership = access.getMembership(context.user.id, result.data.workspaceId);

  const response = NextResponse.json({
    data: {
      activeWorkspace: {
        id: result.data.workspaceId,
        name: workspace?.name ?? result.data.workspaceId,
        role: membership?.roleName ?? "Member",
      },
    },
  });

  response.cookies.set(ACTIVE_WORKSPACE_COOKIE_NAME, result.data.workspaceId, demoCookieOptions);
  return response;
}

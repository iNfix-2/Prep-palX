import type { NextRequest } from "next/server";
import { apiError, apiOk } from "@/lib/server/api-response";
import { getRequestAuthContext } from "@/lib/server/auth-context";
import { demoWorkspaces } from "@/lib/server/demo-store";

export async function GET(request: NextRequest) {
  const context = getRequestAuthContext(request);

  if (context.status === "unauthenticated") {
    return apiError("AUTH_REQUIRED", "Sign in to continue.", 401);
  }

  return apiOk({
    activeWorkspaceId: context.activeWorkspace.id,
    workspaces: context.memberships.map((membership) => {
      const workspace = demoWorkspaces.find((item) => item.id === membership.workspaceId);

      return {
        id: membership.workspaceId,
        name: workspace?.name ?? membership.workspaceId,
        role: membership.roleName,
        jobTitle: membership.jobTitle,
      };
    }),
  });
}

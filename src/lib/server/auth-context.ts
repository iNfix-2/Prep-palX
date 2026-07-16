import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import {
  findDemoUserBySession,
  getDefaultWorkspaceForUser,
  getMembership,
  getWorkspace,
  listMembershipsForUser,
  toPublicUser,
  type DemoMembership,
  type DemoWorkspace,
} from "@/lib/server/demo-store";

export const SESSION_COOKIE_NAME = "prep_pal_session";
export const ACTIVE_WORKSPACE_COOKIE_NAME = "prep_pal_workspace";

export const demoCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 8,
};

export type PublicUser = ReturnType<typeof toPublicUser>;

export type RequestAuthContext =
  | {
      status: "unauthenticated";
      user: null;
      memberships: [];
      activeWorkspace: null;
      activeMembership: null;
    }
  | {
      status: "authenticated";
      user: PublicUser;
      memberships: DemoMembership[];
      activeWorkspace: DemoWorkspace;
      activeMembership: DemoMembership;
    };

export async function getPageAuthContext(): Promise<RequestAuthContext> {
  const cookieStore = await cookies();
  return resolveAuthContext({
    sessionToken: cookieStore.get(SESSION_COOKIE_NAME)?.value,
    workspaceId: cookieStore.get(ACTIVE_WORKSPACE_COOKIE_NAME)?.value,
  });
}

export function getRequestAuthContext(request: NextRequest): RequestAuthContext {
  return resolveAuthContext({
    sessionToken: request.cookies.get(SESSION_COOKIE_NAME)?.value,
    workspaceId: request.cookies.get(ACTIVE_WORKSPACE_COOKIE_NAME)?.value,
  });
}

export function resolveAuthContext({
  sessionToken,
  workspaceId,
}: {
  sessionToken?: string;
  workspaceId?: string;
}): RequestAuthContext {
  const user = findDemoUserBySession(sessionToken);

  if (!user) {
    return {
      status: "unauthenticated",
      user: null,
      memberships: [],
      activeWorkspace: null,
      activeMembership: null,
    };
  }

  const memberships = listMembershipsForUser(user.id);
  const requestedMembership = workspaceId ? getMembership(user.id, workspaceId) : null;
  const fallbackWorkspace = getDefaultWorkspaceForUser(user.id);
  const activeWorkspace =
    (requestedMembership ? getWorkspace(requestedMembership.workspaceId) : null) ??
    fallbackWorkspace;

  if (!activeWorkspace) {
    return {
      status: "unauthenticated",
      user: null,
      memberships: [],
      activeWorkspace: null,
      activeMembership: null,
    };
  }

  const activeMembership = getMembership(user.id, activeWorkspace.id);

  if (!activeMembership) {
    return {
      status: "unauthenticated",
      user: null,
      memberships: [],
      activeWorkspace: null,
      activeMembership: null,
    };
  }

  return {
    status: "authenticated",
    user: toPublicUser(user),
    memberships,
    activeWorkspace,
    activeMembership,
  };
}

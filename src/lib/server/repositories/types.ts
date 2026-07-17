import type {
  DemoAccountSettings,
  DemoAccountSettingsUpdate,
  DemoMembership,
  DemoSession,
  DemoUser,
  DemoWorkspace,
} from "@/lib/server/demo-store";

export interface PublicUser {
  id: string;
  displayName: string;
  shortName: string;
  email: string;
}

export interface AccessRepository {
  authenticateUser(
    email: string,
    password: string,
  ): { user: DemoUser; session: DemoSession } | null;
  findUserBySession(token: string | undefined): DemoUser | null;
  toPublicUser(user: DemoUser): PublicUser;
  listMembershipsForUser(userId: string): DemoMembership[];
  getMembership(userId: string, workspaceId: string): DemoMembership | null;
  getWorkspace(workspaceId: string): DemoWorkspace | null;
  getDefaultWorkspaceForUser(userId: string): DemoWorkspace | null;
}

export interface AccountSettingsRepository {
  getForMembership(membershipId: string): DemoAccountSettings;
  updateForMembership(
    membershipId: string,
    update: DemoAccountSettingsUpdate,
  ): DemoAccountSettings;
}

export interface RepositoryRegistry {
  access: AccessRepository;
  accountSettings: AccountSettingsRepository;
}

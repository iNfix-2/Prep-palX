import {
  authenticateDemoUser,
  findDemoUserBySession,
  getDefaultWorkspaceForUser,
  getDemoAccountSettings,
  getMembership,
  getWorkspace,
  listMembershipsForUser,
  toPublicUser,
  updateDemoAccountSettings,
} from "@/lib/server/demo-store";
import type { AccountSettingsRepository, AccessRepository } from "@/lib/server/repositories/types";

export const demoAccessRepository: AccessRepository = {
  authenticateUser: authenticateDemoUser,
  findUserBySession: findDemoUserBySession,
  toPublicUser,
  listMembershipsForUser,
  getMembership,
  getWorkspace,
  getDefaultWorkspaceForUser,
};

export const demoAccountSettingsRepository: AccountSettingsRepository = {
  getForMembership: getDemoAccountSettings,
  updateForMembership: updateDemoAccountSettings,
};

import {
  demoAccessRepository,
  demoAccountSettingsRepository,
} from "@/lib/server/repositories/demo-repositories";
import type { RepositoryRegistry } from "@/lib/server/repositories/types";

const repositories: RepositoryRegistry = {
  access: demoAccessRepository,
  accountSettings: demoAccountSettingsRepository,
};

export function getRepositories() {
  return repositories;
}

export type { PublicUser } from "@/lib/server/repositories/types";

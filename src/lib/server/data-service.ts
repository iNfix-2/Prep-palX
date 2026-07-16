import { askPalMock } from "@/lib/ask-pal-data";
import { teacherDashboardMock } from "@/lib/dashboard-data";
import { builderPages, workspacePages } from "@/lib/workspace-data";

export async function getTeacherOverview() {
  return teacherDashboardMock;
}

export async function getAskPalWorkspace() {
  return askPalMock;
}

export async function listWorkspaceSections() {
  return Object.entries(workspacePages).map(([slug, page]) => ({
    slug,
    title: page.title,
    description: page.description,
    metrics: page.metrics.length,
  }));
}

export async function getWorkspacePage(slug: string) {
  return workspacePages[slug] ?? null;
}

export async function getBuilderPage(slug: string) {
  return builderPages[slug] ?? null;
}

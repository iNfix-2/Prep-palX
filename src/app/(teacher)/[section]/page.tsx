import { notFound } from "next/navigation";
import { WorkspacePage } from "@/components/workspace/workspace-page";
import { getWorkspacePage } from "@/lib/server/data-service";

export default async function TeacherSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const config = await getWorkspacePage(section);

  if (!config) {
    notFound();
  }

  return <WorkspacePage config={config} />;
}

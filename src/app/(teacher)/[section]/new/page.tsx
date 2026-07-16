import { notFound } from "next/navigation";
import { BuilderPage } from "@/components/workspace/builder-page";
import { getBuilderPage } from "@/lib/server/data-service";

export default async function TeacherBuilderPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const config = await getBuilderPage(section);

  if (!config) {
    notFound();
  }

  return <BuilderPage config={config} />;
}

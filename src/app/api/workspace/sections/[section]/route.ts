import { getWorkspacePage } from "@/lib/server/data-service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ section: string }> },
) {
  const { section } = await params;
  const data = await getWorkspacePage(section);

  if (!data) {
    return Response.json({ error: "Workspace section not found" }, { status: 404 });
  }

  return Response.json({ data });
}

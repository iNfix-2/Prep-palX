import { getAskPalWorkspace } from "@/lib/server/data-service";

export async function GET() {
  return Response.json({ data: await getAskPalWorkspace() });
}

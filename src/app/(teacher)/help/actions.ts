"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type {
  SupportGuideCategory,
  SupportRequestPriority,
} from "@/lib/features/help/types";
import { getPageAuthContext } from "@/lib/server/auth-context";
import { createSupportRequest } from "@/lib/server/help-service";

export async function createSupportRequestAction(formData: FormData) {
  const result = createSupportRequest(await getPageAuthContext(), {
    title: String(formData.get("title") ?? ""),
    summary: String(formData.get("summary") ?? ""),
    category: String(formData.get("category") ?? "") as SupportGuideCategory,
    priority: String(formData.get("priority") ?? "") as SupportRequestPriority,
  });

  if (!result.ok) {
    redirect(`/help?error=${result.code}`);
  }

  revalidatePath("/help");
  redirect(`/help/${result.data.id}?created=1`);
}

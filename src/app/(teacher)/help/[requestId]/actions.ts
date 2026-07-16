"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SupportRequestStatus } from "@/lib/features/help/types";
import { getPageAuthContext } from "@/lib/server/auth-context";
import { addSupportMessage } from "@/lib/server/help-service";

export async function addSupportMessageAction(requestId: string, formData: FormData) {
  const rawStatus = String(formData.get("status") ?? "");
  const result = addSupportMessage(await getPageAuthContext(), requestId, {
    body: String(formData.get("body") ?? ""),
    status: rawStatus ? (rawStatus as SupportRequestStatus) : undefined,
  });

  if (!result.ok) {
    redirect(`/help/${requestId}?error=${result.code}`);
  }

  revalidatePath("/help");
  revalidatePath(`/help/${requestId}`);
  redirect(`/help/${requestId}?saved=1`);
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { TaskStatus } from "@/lib/features/tasks/types";
import { getPageAuthContext } from "@/lib/server/auth-context";
import { updateTaskStatus } from "@/lib/server/tasks-service";

const supportedStatuses: TaskStatus[] = ["open", "in_progress", "blocked", "done"];

export async function updateTaskStatusAction(taskId: string, formData: FormData) {
  const rawStatus = String(formData.get("status") ?? "");
  const result = updateTaskStatus(await getPageAuthContext(), taskId, {
    status: isTaskStatus(rawStatus) ? rawStatus : (rawStatus as TaskStatus),
    note: String(formData.get("note") ?? ""),
  });

  if (!result.ok) {
    redirect(`/my-tasks/${taskId}?error=${result.code}`);
  }

  revalidatePath("/my-tasks");
  revalidatePath(`/my-tasks/${taskId}`);

  if (result.data.sourceHref) {
    revalidatePath(result.data.sourceHref);
  }

  redirect(`/my-tasks/${taskId}?saved=1`);
}

function isTaskStatus(value: string): value is TaskStatus {
  return supportedStatuses.includes(value as TaskStatus);
}

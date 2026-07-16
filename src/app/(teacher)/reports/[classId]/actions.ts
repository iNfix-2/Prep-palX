"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type {
  ReportCommentStatus,
  SaveReportCommentDto,
} from "@/lib/features/reports/types";
import { getPageAuthContext } from "@/lib/server/auth-context";
import { saveReportComments } from "@/lib/server/reports-service";

const supportedStatuses: ReportCommentStatus[] = ["draft", "ready"];

export async function saveReportCommentsAction(classId: string, formData: FormData) {
  const result = saveReportComments(await getPageAuthContext(), classId, {
    comments: collectReportComments(formData),
  });

  if (!result.ok) {
    redirect(`/reports/${classId}?error=${result.code}`);
  }

  revalidatePath("/reports");
  revalidatePath(`/reports/${classId}`);
  redirect(`/reports/${classId}?saved=1`);
}

function collectReportComments(formData: FormData): SaveReportCommentDto[] {
  const comments: SaveReportCommentDto[] = [];

  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("status:")) {
      continue;
    }

    const learnerId = key.replace("status:", "");
    const status = String(value);

    if (!isCommentStatus(status)) {
      continue;
    }

    comments.push({
      learnerId,
      status,
      comment: String(formData.get(`comment:${learnerId}`) ?? ""),
    });
  }

  return comments;
}

function isCommentStatus(value: string): value is ReportCommentStatus {
  return supportedStatuses.includes(value as ReportCommentStatus);
}

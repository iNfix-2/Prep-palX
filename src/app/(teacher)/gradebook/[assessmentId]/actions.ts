"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type {
  GradebookScoreStatus,
  SaveGradebookScoreDto,
} from "@/lib/features/gradebook/types";
import { getPageAuthContext } from "@/lib/server/auth-context";
import { saveGradebookScores } from "@/lib/server/gradebook-service";

const supportedStatuses: GradebookScoreStatus[] = ["scored", "missing", "excused"];

export async function saveGradebookScoresAction(assessmentId: string, formData: FormData) {
  const result = saveGradebookScores(await getPageAuthContext(), assessmentId, {
    scores: collectScoreRows(formData),
  });

  if (!result.ok) {
    redirect(`/gradebook/${assessmentId}?error=${result.code}`);
  }

  revalidatePath("/gradebook");
  revalidatePath(`/gradebook/${assessmentId}`);
  redirect(`/gradebook/${assessmentId}?saved=1`);
}

function collectScoreRows(formData: FormData): SaveGradebookScoreDto[] {
  const scores: SaveGradebookScoreDto[] = [];

  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("status:")) {
      continue;
    }

    const learnerId = key.replace("status:", "");
    const status = String(value);

    if (!isScoreStatus(status)) {
      continue;
    }

    const rawScore = String(formData.get(`score:${learnerId}`) ?? "").trim();
    const feedback = String(formData.get(`feedback:${learnerId}`) ?? "").trim();

    scores.push({
      learnerId,
      status,
      score: rawScore ? Number(rawScore) : null,
      ...(feedback ? { feedback } : {}),
    });
  }

  return scores;
}

function isScoreStatus(value: string): value is GradebookScoreStatus {
  return supportedStatuses.includes(value as GradebookScoreStatus);
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type {
  AssessmentType,
  CreateAssessmentDto,
  CreateAssessmentItemDto,
} from "@/lib/features/assessments/types";
import { getPageAuthContext } from "@/lib/server/auth-context";
import { createAssessment } from "@/lib/server/assessments-service";

export async function createAssessmentAction(formData: FormData) {
  const result = createAssessment(await getPageAuthContext(), toCreateAssessmentDto(formData));

  if (!result.ok) {
    redirect(`/assessments/new?error=${result.code}`);
  }

  revalidatePath("/assessments");
  redirect(`/assessments/${result.data.id}?saved=1`);
}

function toCreateAssessmentDto(formData: FormData): CreateAssessmentDto {
  return {
    classId: String(formData.get("classId") ?? ""),
    title: String(formData.get("title") ?? ""),
    type: String(formData.get("type") ?? "quiz") as AssessmentType,
    scheduledFor: String(formData.get("scheduledFor") ?? ""),
    dueDate: String(formData.get("dueDate") ?? ""),
    durationMinutes: Number(formData.get("durationMinutes") ?? 0),
    totalMarks: Number(formData.get("totalMarks") ?? 0),
    topics: toLines(formData.get("topics")),
    instructions: String(formData.get("instructions") ?? ""),
    items: toItems(formData.get("items")),
    reviewNotes: String(formData.get("reviewNotes") ?? ""),
  };
}

function toLines(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function toItems(value: FormDataEntryValue | null): CreateAssessmentItemDto[] {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [prompt = "", marks = "", ...skillParts] = line.split("|");
      return {
        prompt: prompt.trim(),
        marks: Number(marks.trim()),
        skill: skillParts.join("|").trim(),
      };
    });
}

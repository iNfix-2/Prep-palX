"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { CreateLessonPlanDto } from "@/lib/features/lesson-plans/types";
import { getPageAuthContext } from "@/lib/server/auth-context";
import { createLessonPlan } from "@/lib/server/lesson-plans-service";

export async function createLessonPlanAction(formData: FormData) {
  const result = createLessonPlan(await getPageAuthContext(), toCreateLessonPlanDto(formData));

  if (!result.ok) {
    redirect(`/lesson-planner/new?error=${result.code}`);
  }

  revalidatePath("/lesson-planner");
  redirect(`/lesson-planner/${result.data.id}?saved=1`);
}

function toCreateLessonPlanDto(formData: FormData): CreateLessonPlanDto {
  return {
    classId: String(formData.get("classId") ?? ""),
    title: String(formData.get("title") ?? ""),
    topic: String(formData.get("topic") ?? ""),
    scheduledFor: String(formData.get("scheduledFor") ?? ""),
    durationMinutes: Number(formData.get("durationMinutes") ?? 0),
    objectives: toLines(formData.get("objectives")),
    materials: toLines(formData.get("materials")),
    starterActivity: String(formData.get("starterActivity") ?? ""),
    teachingActivity: String(formData.get("teachingActivity") ?? ""),
    learnerPractice: String(formData.get("learnerPractice") ?? ""),
    assessmentCheck: String(formData.get("assessmentCheck") ?? ""),
    differentiation: String(formData.get("differentiation") ?? ""),
  };
}

function toLines(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

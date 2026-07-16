"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type {
  CreateQuestionDto,
  QuestionDifficulty,
  QuestionStatus,
  QuestionType,
} from "@/lib/features/question-bank/types";
import { getPageAuthContext } from "@/lib/server/auth-context";
import { createQuestion } from "@/lib/server/question-bank-service";

export async function createQuestionAction(formData: FormData) {
  const result = createQuestion(await getPageAuthContext(), toCreateQuestionDto(formData));

  if (!result.ok) {
    redirect(`/question-bank/new?error=${result.code}`);
  }

  revalidatePath("/question-bank");
  redirect(`/question-bank/${result.data.id}?saved=1`);
}

function toCreateQuestionDto(formData: FormData): CreateQuestionDto {
  return {
    classId: String(formData.get("classId") ?? ""),
    prompt: String(formData.get("prompt") ?? ""),
    type: String(formData.get("type") ?? "multiple_choice") as QuestionType,
    difficulty: String(formData.get("difficulty") ?? "medium") as QuestionDifficulty,
    status: String(formData.get("status") ?? "draft") as QuestionStatus,
    marks: Number(formData.get("marks") ?? 0),
    topic: String(formData.get("topic") ?? ""),
    skill: String(formData.get("skill") ?? ""),
    options: toLines(formData.get("options")),
    answer: String(formData.get("answer") ?? ""),
    explanation: String(formData.get("explanation") ?? ""),
  };
}

function toLines(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

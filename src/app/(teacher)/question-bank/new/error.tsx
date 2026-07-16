"use client";

import { ErrorState } from "@/components/states/data-states";

export default function NewQuestionError() {
  return (
    <ErrorState
      message="Question form could not be loaded."
      action={{ label: "Back to question bank", href: "/question-bank", icon: "quiz" }}
    />
  );
}

"use client";

import { ErrorState } from "@/components/states/data-states";

export default function QuestionDetailError() {
  return (
    <ErrorState
      message="Question detail could not be loaded."
      action={{ label: "Back to question bank", href: "/question-bank", icon: "quiz" }}
    />
  );
}

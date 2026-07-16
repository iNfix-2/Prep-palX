"use client";

import { ErrorState } from "@/components/states/data-states";

export default function QuestionBankError() {
  return (
    <ErrorState
      message="Question bank could not be loaded."
      action={{ label: "Try again", href: "/question-bank", icon: "task_alt" }}
    />
  );
}

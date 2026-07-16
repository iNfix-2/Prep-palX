"use client";

import { ErrorState } from "@/components/states/data-states";

export default function GradebookSheetError() {
  return (
    <ErrorState
      message="The score sheet could not be loaded."
      action={{ label: "Back to gradebook", href: "/gradebook", icon: "grading" }}
    />
  );
}

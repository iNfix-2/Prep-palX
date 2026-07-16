"use client";

import { ErrorState } from "@/components/states/data-states";

export default function GradebookError() {
  return (
    <ErrorState
      message="The gradebook could not be loaded."
      action={{ label: "Try again", href: "/gradebook", icon: "task_alt" }}
    />
  );
}

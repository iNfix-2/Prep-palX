"use client";

import { ErrorState } from "@/components/states/data-states";

export default function AssessmentsError() {
  return (
    <ErrorState
      message="Assessments could not be loaded."
      action={{ label: "Try again", href: "/assessments", icon: "task_alt" }}
    />
  );
}

"use client";

import { ErrorState } from "@/components/states/data-states";

export default function AssessmentDetailError() {
  return (
    <ErrorState
      message="The assessment could not be loaded."
      action={{ label: "Back to assessments", href: "/assessments", icon: "assignment" }}
    />
  );
}

"use client";

import { ErrorState } from "@/components/states/data-states";

export default function NewAssessmentError() {
  return (
    <ErrorState
      message="The assessment draft form could not be loaded."
      action={{ label: "Back to assessments", href: "/assessments", icon: "assignment" }}
    />
  );
}

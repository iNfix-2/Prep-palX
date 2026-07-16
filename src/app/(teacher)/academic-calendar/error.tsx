"use client";

import { ErrorState } from "@/components/states/data-states";

export default function AcademicCalendarError() {
  return (
    <ErrorState
      message="The academic calendar could not be loaded."
      action={{ label: "Back to classes", href: "/classes", icon: "groups" }}
    />
  );
}

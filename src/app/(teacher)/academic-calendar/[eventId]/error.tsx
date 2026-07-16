"use client";

import { ErrorState } from "@/components/states/data-states";

export default function AcademicCalendarEventError() {
  return (
    <ErrorState
      message="The calendar event could not be loaded."
      action={{ label: "Back to calendar", href: "/academic-calendar", icon: "calendar_month" }}
    />
  );
}

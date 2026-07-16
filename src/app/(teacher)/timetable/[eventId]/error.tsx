"use client";

import { ErrorState } from "@/components/states/data-states";

export default function TimetableEventError() {
  return (
    <ErrorState
      message="Timetable event could not be loaded."
      action={{ label: "Back to timetable", href: "/timetable", icon: "calendar_view_day" }}
    />
  );
}

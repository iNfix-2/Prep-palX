"use client";

import { ErrorState } from "@/components/states/data-states";

export default function TimetableError() {
  return (
    <ErrorState
      message="Timetable could not be loaded."
      action={{ label: "Try again", href: "/timetable", icon: "task_alt" }}
    />
  );
}

"use client";

import { ErrorState } from "@/components/states/data-states";

export default function AttendanceError() {
  return (
    <ErrorState
      message="The attendance workspace could not be loaded."
      action={{ label: "Try again", href: "/attendance", icon: "task_alt" }}
    />
  );
}

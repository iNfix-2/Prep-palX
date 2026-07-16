"use client";

import { ErrorState } from "@/components/states/data-states";

export default function LessonPlannerError() {
  return (
    <ErrorState
      message="The lesson planner could not be loaded."
      action={{ label: "Try again", href: "/lesson-planner", icon: "task_alt" }}
    />
  );
}

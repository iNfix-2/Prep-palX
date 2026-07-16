"use client";

import { ErrorState } from "@/components/states/data-states";

export default function LessonPlanDetailError() {
  return (
    <ErrorState
      message="The lesson plan could not be loaded."
      action={{ label: "Back to planner", href: "/lesson-planner", icon: "auto_stories" }}
    />
  );
}

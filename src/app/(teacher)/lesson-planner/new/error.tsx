"use client";

import { ErrorState } from "@/components/states/data-states";

export default function NewLessonPlanError() {
  return (
    <ErrorState
      message="The lesson plan form could not be loaded."
      action={{ label: "Back to planner", href: "/lesson-planner", icon: "auto_stories" }}
    />
  );
}

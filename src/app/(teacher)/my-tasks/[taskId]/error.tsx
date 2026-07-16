"use client";

import { ErrorState } from "@/components/states/data-states";

export default function MyTaskDetailError() {
  return (
    <ErrorState
      message="The task detail could not be loaded."
      action={{ label: "Back to tasks", href: "/my-tasks", icon: "task_alt" }}
    />
  );
}

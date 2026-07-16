"use client";

import { ErrorState } from "@/components/states/data-states";

export default function MyTasksError() {
  return (
    <ErrorState
      message="The task queue could not be loaded."
      action={{ label: "Back to classes", href: "/classes", icon: "groups" }}
    />
  );
}

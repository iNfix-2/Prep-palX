"use client";

import { ErrorState } from "@/components/states/data-states";

export default function TeacherDashboardError() {
  return (
    <ErrorState
      title="Dashboard failed to load"
      message="Refresh the page or open your classes."
      action={{ label: "Open classes", href: "/classes", icon: "groups" }}
    />
  );
}

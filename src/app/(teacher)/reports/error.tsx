"use client";

import { ErrorState } from "@/components/states/data-states";

export default function ReportsError() {
  return (
    <ErrorState
      message="The reports workspace could not be loaded."
      action={{ label: "Try again", href: "/reports", icon: "analytics" }}
    />
  );
}

"use client";

import { ErrorState } from "@/components/states/data-states";

export default function ClassReportError() {
  return (
    <ErrorState
      message="The class report could not be loaded."
      action={{ label: "Back to reports", href: "/reports", icon: "analytics" }}
    />
  );
}

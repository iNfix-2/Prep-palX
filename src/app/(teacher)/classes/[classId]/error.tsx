"use client";

import { ErrorState } from "@/components/states/data-states";

export default function ClassOverviewError() {
  return (
    <ErrorState
      message="The class overview could not be loaded."
      action={{ label: "Back to classes", href: "/classes", icon: "groups" }}
    />
  );
}

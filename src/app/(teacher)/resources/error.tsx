"use client";

import { ErrorState } from "@/components/states/data-states";

export default function ResourcesError() {
  return (
    <ErrorState
      message="The resource library could not be loaded."
      action={{ label: "Back to classes", href: "/classes", icon: "groups" }}
    />
  );
}

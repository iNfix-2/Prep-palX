"use client";

import { ErrorState } from "@/components/states/data-states";

export default function HelpError() {
  return (
    <ErrorState
      message="The help centre could not be loaded."
      action={{ label: "Back to classes", href: "/classes", icon: "groups" }}
    />
  );
}

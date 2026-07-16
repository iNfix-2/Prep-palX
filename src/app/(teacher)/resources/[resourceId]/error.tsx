"use client";

import { ErrorState } from "@/components/states/data-states";

export default function ResourceError() {
  return (
    <ErrorState
      message="The resource could not be loaded."
      action={{ label: "Back to resources", href: "/resources", icon: "folder_open" }}
    />
  );
}

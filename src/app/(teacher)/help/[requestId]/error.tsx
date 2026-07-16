"use client";

import { ErrorState } from "@/components/states/data-states";

export default function SupportRequestError() {
  return (
    <ErrorState
      message="The support request could not be loaded."
      action={{ label: "Back to help", href: "/help", icon: "help" }}
    />
  );
}

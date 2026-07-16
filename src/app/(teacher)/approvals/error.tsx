"use client";

import { ErrorState } from "@/components/states/data-states";

export default function ApprovalsError() {
  return (
    <ErrorState
      message="The approvals workspace could not be loaded."
      action={{ label: "Try again", href: "/approvals", icon: "verified_user" }}
    />
  );
}

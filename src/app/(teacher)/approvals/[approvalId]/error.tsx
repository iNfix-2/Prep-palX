"use client";

import { ErrorState } from "@/components/states/data-states";

export default function ApprovalDetailError() {
  return (
    <ErrorState
      message="The approval request could not be loaded."
      action={{ label: "Back to approvals", href: "/approvals", icon: "verified_user" }}
    />
  );
}

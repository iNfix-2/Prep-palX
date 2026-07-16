"use client";

import { ErrorState } from "@/components/states/data-states";

export default function SettingsError() {
  return (
    <ErrorState
      title="Settings failed to load"
      message="Refresh the page or return to the dashboard."
      action={{ label: "Back home", href: "/", icon: "home" }}
    />
  );
}

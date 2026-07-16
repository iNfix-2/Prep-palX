"use client";

import { ErrorState } from "@/components/states/data-states";

export default function AttendanceRegisterError() {
  return (
    <ErrorState
      message="The attendance register could not be loaded."
      action={{ label: "Back to attendance", href: "/attendance", icon: "how_to_reg" }}
    />
  );
}

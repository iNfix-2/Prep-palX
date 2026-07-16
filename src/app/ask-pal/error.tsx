"use client";

import { ErrorState } from "@/components/states/data-states";

export default function AskPalError() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <ErrorState
        title="Ask Pal unavailable"
        message="Prep Pal could not load the assistant workspace."
        action={{ label: "Open help", href: "/help", icon: "help" }}
      />
    </div>
  );
}

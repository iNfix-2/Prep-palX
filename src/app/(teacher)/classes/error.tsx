"use client";

import { ErrorState } from "@/components/states/data-states";

export default function ClassesError({ reset }: { reset: () => void }) {
  return (
    <div>
      <ErrorState
        message="The classes workspace could not be loaded."
        action={{ label: "Try again", href: "/classes", icon: "task_alt" }}
      />
      <button
        type="button"
        onClick={reset}
        className="sr-only"
      >
        Retry
      </button>
    </div>
  );
}

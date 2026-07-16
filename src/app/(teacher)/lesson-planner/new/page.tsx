import { LessonPlanForm } from "@/components/lesson-plans/lesson-plan-form";
import {
  EmptyState,
  ForbiddenState,
  UnauthorizedState,
} from "@/components/states/data-states";
import { getPageAuthContext } from "@/lib/server/auth-context";
import { getLessonPlanCreateOptions } from "@/lib/server/lesson-plans-service";
import { createLessonPlanAction } from "@/app/(teacher)/lesson-planner/new/actions";

export default async function NewLessonPlanPage({
  searchParams,
}: {
  searchParams: Promise<{ classId?: string; error?: string }>;
}) {
  const { classId, error } = await searchParams;
  const result = getLessonPlanCreateOptions(await getPageAuthContext());

  if (!result.ok) {
    if (result.status === 401) {
      return <UnauthorizedState />;
    }

    return <ForbiddenState message={result.message} />;
  }

  if (result.data.classes.length === 0) {
    return (
      <EmptyState
        title="No classes available"
        message="Lesson drafts can be created once a class is assigned in this workspace."
        action={{ label: "Open classes", href: "/classes", icon: "groups" }}
      />
    );
  }

  return (
    <LessonPlanForm
      options={result.data}
      action={createLessonPlanAction}
      defaultClassId={classId}
      error={error}
    />
  );
}

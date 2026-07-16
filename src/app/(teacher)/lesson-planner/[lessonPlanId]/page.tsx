import { LessonPlanDetail } from "@/components/lesson-plans/lesson-plan-detail";
import {
  ErrorState,
  ForbiddenState,
  UnauthorizedState,
} from "@/components/states/data-states";
import { toLessonPlanDetailView } from "@/lib/features/lesson-plans/adapters";
import { getPageAuthContext } from "@/lib/server/auth-context";
import { getLessonPlan } from "@/lib/server/lesson-plans-service";

export default async function LessonPlanDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ lessonPlanId: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { lessonPlanId } = await params;
  const { saved } = await searchParams;
  const result = getLessonPlan(await getPageAuthContext(), lessonPlanId);

  if (!result.ok) {
    if (result.status === 401) {
      return <UnauthorizedState />;
    }

    if (result.status === 403) {
      return <ForbiddenState message={result.message} />;
    }

    return (
      <ErrorState
        title="Lesson plan not found"
        message={result.message}
        action={{ label: "Back to planner", href: "/lesson-planner", icon: "auto_stories" }}
      />
    );
  }

  return <LessonPlanDetail view={toLessonPlanDetailView(result.data)} saved={saved === "1"} />;
}

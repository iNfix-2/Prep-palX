import { TaskDetail } from "@/components/tasks/task-detail";
import {
  ErrorState,
  ForbiddenState,
  UnauthorizedState,
} from "@/components/states/data-states";
import { toTaskDetailView } from "@/lib/features/tasks/adapters";
import { getPageAuthContext } from "@/lib/server/auth-context";
import { getTaskDetail } from "@/lib/server/tasks-service";
import { updateTaskStatusAction } from "./actions";

export default async function MyTaskDetailPage({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = await params;
  const result = getTaskDetail(await getPageAuthContext(), taskId);

  if (!result.ok) {
    if (result.status === 401) {
      return <UnauthorizedState />;
    }

    if (result.status === 403) {
      return <ForbiddenState message={result.message} />;
    }

    return (
      <ErrorState
        title="Task not found"
        message={result.message}
        action={{ label: "Back to tasks", href: "/my-tasks", icon: "task_alt" }}
      />
    );
  }

  return (
    <TaskDetail
      view={toTaskDetailView(result.data)}
      statusAction={updateTaskStatusAction.bind(null, taskId)}
    />
  );
}

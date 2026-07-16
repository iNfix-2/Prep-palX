import { TimetableEventDetail } from "@/components/timetable/timetable-event-detail";
import {
  ErrorState,
  ForbiddenState,
  UnauthorizedState,
} from "@/components/states/data-states";
import { toTimetableEventDetailView } from "@/lib/features/timetable/adapters";
import { getPageAuthContext } from "@/lib/server/auth-context";
import { getTimetableEvent } from "@/lib/server/timetable-service";

export default async function TimetableEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const result = getTimetableEvent(await getPageAuthContext(), eventId);

  if (!result.ok) {
    if (result.status === 401) {
      return <UnauthorizedState />;
    }

    if (result.status === 403) {
      return <ForbiddenState message={result.message} />;
    }

    return (
      <ErrorState
        title="Timetable event not found"
        message={result.message}
        action={{ label: "Back to timetable", href: "/timetable", icon: "calendar_view_day" }}
      />
    );
  }

  return <TimetableEventDetail view={toTimetableEventDetailView(result.data)} />;
}

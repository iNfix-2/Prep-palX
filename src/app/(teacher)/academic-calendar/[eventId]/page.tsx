import { CalendarEventDetail } from "@/components/academic-calendar/calendar-event-detail";
import {
  ErrorState,
  ForbiddenState,
  UnauthorizedState,
} from "@/components/states/data-states";
import { toAcademicCalendarEventDetailView } from "@/lib/features/academic-calendar/adapters";
import { getPageAuthContext } from "@/lib/server/auth-context";
import { getAcademicCalendarEvent } from "@/lib/server/academic-calendar-service";

export default async function AcademicCalendarEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const result = getAcademicCalendarEvent(await getPageAuthContext(), eventId);

  if (!result.ok) {
    if (result.status === 401) {
      return <UnauthorizedState />;
    }

    if (result.status === 403) {
      return <ForbiddenState message={result.message} />;
    }

    return (
      <ErrorState
        title="Calendar event not found"
        message={result.message}
        action={{
          label: "Back to calendar",
          href: "/academic-calendar",
          icon: "calendar_month",
        }}
      />
    );
  }

  return <CalendarEventDetail view={toAcademicCalendarEventDetailView(result.data)} />;
}

import type {
  TeacherTimetableResponseDto,
  TimetableEventCardView,
  TimetableEventDetailDto,
  TimetableEventDetailView,
  TimetableEventDto,
  TimetablePageView,
} from "@/lib/features/timetable/types";

const statusView = {
  scheduled: { label: "Scheduled", tone: "draft" },
  in_progress: { label: "In progress", tone: "review" },
  completed: { label: "Completed", tone: "approved" },
  conflict: { label: "Conflict", tone: "changes" },
} as const;

const preparationView = {
  ready: { label: "Ready", tone: "approved" },
  needs_preparation: { label: "Needs prep", tone: "review" },
  blocked: { label: "Blocked", tone: "changes" },
} as const;

const typeView = {
  lesson: { label: "Lesson", tone: "primary" },
  assessment: { label: "Assessment", tone: "review" },
  duty: { label: "Duty", tone: "neutral" },
  meeting: { label: "Meeting", tone: "approved" },
} as const;

export function toTimetablePageView(dto: TeacherTimetableResponseDto): TimetablePageView {
  const locationCount = new Set(dto.events.map((event) => event.location)).size;

  return {
    workspaceName: dto.workspace.name,
    selectedDateLabel: formatDateLabel(dto.selectedDate),
    totalEvents: dto.events.length,
    teachingBlockCount: dto.events.filter(
      (event) => event.type === "lesson" || event.type === "assessment",
    ).length,
    preparationIssueCount: dto.events.filter(
      (event) => event.preparationStatus !== "ready",
    ).length,
    locationCount,
    canUseAi: dto.permissions.canUseAi,
    events: dto.events.map(toTimetableEventCardView),
  };
}

export function toTimetableEventCardView(
  dto: TimetableEventDto,
): TimetableEventCardView {
  const status = statusView[dto.status];
  const preparation = preparationView[dto.preparationStatus];
  const type = typeView[dto.type];

  return {
    id: dto.id,
    href: `/timetable/${dto.id}`,
    title: dto.title,
    classLabel: dto.classDisplayName ?? "Workspace event",
    subjectLabel:
      dto.subjectName && dto.gradeName ? `${dto.subjectName} / ${dto.gradeName}` : "School day",
    typeLabel: type.label,
    typeTone: type.tone,
    statusLabel: status.label,
    statusTone: status.tone,
    preparationLabel: preparation.label,
    preparationTone: preparation.tone,
    timeRangeLabel: `${formatTimeLabel(dto.startAt)} - ${formatTimeLabel(dto.endAt)}`,
    locationLabel: dto.location,
    notes: dto.notes,
  };
}

export function toTimetableEventDetailView(
  dto: TimetableEventDetailDto,
): TimetableEventDetailView {
  const card = toTimetableEventCardView(dto);

  return {
    ...card,
    workspaceName: dto.workspace.name,
    teacherName: dto.teacherName,
    dateLabel: formatDateLabel(dto.startAt.slice(0, 10)),
    startLabel: formatTimeLabel(dto.startAt),
    endLabel: formatTimeLabel(dto.endAt),
    classHref: dto.classHref,
    lessonPlanHref: dto.lessonPlanHref,
    assessmentHref: dto.assessmentHref,
  };
}

function formatDateLabel(date: string) {
  return new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00.000Z`));
}

function formatTimeLabel(value: string) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(value));
}

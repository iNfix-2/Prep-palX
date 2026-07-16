import type {
  AcademicCalendarEventCardView,
  AcademicCalendarEventDetailDto,
  AcademicCalendarEventDetailView,
  AcademicCalendarEventDto,
  AcademicCalendarPageView,
  TeacherAcademicCalendarResponseDto,
} from "@/lib/features/academic-calendar/types";

const statusView = {
  upcoming: { label: "Upcoming", tone: "draft" },
  active: { label: "Active", tone: "review" },
  completed: { label: "Completed", tone: "approved" },
  at_risk: { label: "At risk", tone: "changes" },
} as const;

const priorityView = {
  normal: { label: "Normal", tone: "neutral" },
  important: { label: "Important", tone: "review" },
  urgent: { label: "Urgent", tone: "changes" },
} as const;

const typeView = {
  term: { label: "Term", icon: "calendar_month", tone: "primary" },
  assessment_window: { label: "Assessment window", icon: "assignment", tone: "review" },
  reporting: { label: "Reporting", icon: "analytics", tone: "primary" },
  school_event: { label: "School event", icon: "groups", tone: "approved" },
  holiday: { label: "Holiday", icon: "calendar_today", tone: "neutral" },
  planning: { label: "Planning", icon: "auto_stories", tone: "neutral" },
} as const;

export function toAcademicCalendarPageView(
  dto: TeacherAcademicCalendarResponseDto,
): AcademicCalendarPageView {
  return {
    workspaceName: dto.workspace.name,
    termLabel: `${dto.term.academicYearName} / ${dto.term.termName}`,
    selectedDateLabel: formatDateLabel(dto.selectedDate),
    termRangeLabel: formatDateRangeLabel(dto.term.startDate, dto.term.endDate),
    termWeekLabel: `Week ${dto.term.weekNumber} of ${dto.term.weekCount}`,
    totalEvents: dto.events.length,
    upcomingCount: dto.events.filter((event) => event.status === "upcoming").length,
    assessmentWindowCount: dto.events.filter((event) => event.type === "assessment_window")
      .length,
    atRiskCount: dto.events.filter((event) => event.status === "at_risk").length,
    canUseAi: dto.permissions.canUseAi,
    events: dto.events.map((event) => toAcademicCalendarEventCardView(event, dto.selectedDate)),
  };
}

export function toAcademicCalendarEventCardView(
  dto: AcademicCalendarEventDto,
  selectedDate: string,
): AcademicCalendarEventCardView {
  const status = statusView[dto.status];
  const priority = priorityView[dto.priority];
  const type = typeView[dto.type];

  return {
    id: dto.id,
    href: `/academic-calendar/${dto.id}`,
    title: dto.title,
    scopeLabel: toScopeLabel(dto),
    subjectLabel:
      dto.subjectName && dto.gradeName ? `${dto.subjectName} / ${dto.gradeName}` : "School calendar",
    typeLabel: type.label,
    typeIcon: type.icon,
    typeTone: type.tone,
    statusLabel: status.label,
    statusTone: status.tone,
    priorityLabel: priority.label,
    priorityTone: priority.tone,
    dateRangeLabel: formatDateRangeLabel(dto.startDate, dto.endDate),
    shortDateLabel: formatShortDateRangeLabel(dto.startDate, dto.endDate),
    relativeLabel: formatRelativeLabel(dto.startDate, dto.endDate, selectedDate),
    locationLabel: dto.location ?? "No location",
    description: dto.description,
    requiredAction: dto.requiredAction,
  };
}

export function toAcademicCalendarEventDetailView(
  dto: AcademicCalendarEventDetailDto,
): AcademicCalendarEventDetailView {
  const card = toAcademicCalendarEventCardView(dto, dto.startDate);

  return {
    ...card,
    workspaceName: dto.workspace.name,
    ownerName: dto.ownerName ?? "Workspace calendar",
    startLabel: formatDateLabel(dto.startDate),
    endLabel: formatDateLabel(dto.endDate),
    termLabel: `${dto.term.academicYearName} / ${dto.term.termName}`,
    termWeekLabel: `Week ${dto.term.weekNumber} of ${dto.term.weekCount}`,
    classHref: dto.classHref,
    timetableHref: dto.timetableHref,
    assessmentHref: dto.assessmentHref,
    reportHref: dto.reportHref,
  };
}

function toScopeLabel(dto: AcademicCalendarEventDto) {
  if (dto.visibility === "teacher") {
    return "Personal planning";
  }

  if (dto.visibility === "class") {
    return dto.classDisplayName ?? "Class milestone";
  }

  return "Workspace-wide";
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

function formatDateRangeLabel(startDate: string, endDate: string) {
  if (startDate === endDate) {
    return formatDateLabel(startDate);
  }

  return `${formatCompactDateLabel(startDate)} - ${formatCompactDateLabel(endDate)}`;
}

function formatShortDateRangeLabel(startDate: string, endDate: string) {
  if (startDate === endDate) {
    return formatCompactDateLabel(startDate);
  }

  return `${formatCompactDateLabel(startDate)} - ${formatCompactDateLabel(endDate)}`;
}

function formatCompactDateLabel(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00.000Z`));
}

function formatRelativeLabel(startDate: string, endDate: string, selectedDate: string) {
  const start = Date.parse(`${startDate}T00:00:00.000Z`);
  const end = Date.parse(`${endDate}T00:00:00.000Z`);
  const selected = Date.parse(`${selectedDate}T00:00:00.000Z`);
  const dayMs = 86_400_000;

  if (selected >= start && selected <= end) {
    return "Active now";
  }

  const dayDiff = Math.round((start - selected) / dayMs);

  if (dayDiff === 0) {
    return "Today";
  }

  if (dayDiff === 1) {
    return "Tomorrow";
  }

  if (dayDiff > 1) {
    return `In ${dayDiff} days`;
  }

  return "Completed";
}

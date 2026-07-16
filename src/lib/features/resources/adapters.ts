import type {
  ResourceCardView,
  ResourceDetailDto,
  ResourceDetailView,
  ResourceDto,
  ResourcesPageView,
  TeacherResourcesResponseDto,
} from "@/lib/features/resources/types";

const statusView = {
  ready: { label: "Ready", tone: "approved" },
  draft: { label: "Draft", tone: "draft" },
  needs_tags: { label: "Needs tags", tone: "review" },
  archived: { label: "Archived", tone: "changes" },
} as const;

const originView = {
  uploaded: { label: "Uploaded", tone: "primary" },
  ai_generated: { label: "AI assisted", tone: "ai" },
  shared: { label: "Shared", tone: "approved" },
} as const;

const typeView = {
  worksheet: { label: "Worksheet", icon: "description", tone: "primary" },
  slide_deck: { label: "Slides", icon: "picture_as_pdf", tone: "neutral" },
  rubric: { label: "Rubric", icon: "grading", tone: "review" },
  guide: { label: "Guide", icon: "school", tone: "approved" },
  link: { label: "Link", icon: "link", tone: "neutral" },
  video: { label: "Video", icon: "picture_as_pdf", tone: "neutral" },
} as const;

const fileKindView = {
  pdf: { label: "PDF", icon: "picture_as_pdf" },
  doc: { label: "Document", icon: "description" },
  slides: { label: "Slides", icon: "picture_as_pdf" },
  link: { label: "Link", icon: "link" },
  video: { label: "Video", icon: "picture_as_pdf" },
  image: { label: "Image", icon: "attach_file" },
} as const;

export function toResourcesPageView(dto: TeacherResourcesResponseDto): ResourcesPageView {
  return {
    workspaceName: dto.workspace.name,
    totalResources: dto.resources.length,
    recentlyUsedCount: dto.resources.filter((resource) => Boolean(resource.lastUsedAt)).length,
    sharedCount: dto.resources.filter((resource) => resource.origin === "shared").length,
    aiGeneratedCount: dto.resources.filter((resource) => resource.origin === "ai_generated").length,
    needsTagsCount: dto.resources.filter((resource) => resource.status === "needs_tags").length,
    canManageResources: dto.permissions.canManageResources,
    canUseAi: dto.permissions.canUseAi,
    resources: dto.resources.map(toResourceCardView),
  };
}

export function toResourceCardView(dto: ResourceDto): ResourceCardView {
  const status = statusView[dto.status];
  const origin = originView[dto.origin];
  const type = typeView[dto.type];
  const file = fileKindView[dto.fileKind];

  return {
    id: dto.id,
    href: `/resources/${dto.id}`,
    title: dto.title,
    scopeLabel: toScopeLabel(dto),
    subjectLabel:
      dto.subjectName && dto.gradeName ? `${dto.subjectName} / ${dto.gradeName}` : "Resource library",
    typeLabel: type.label,
    typeIcon: type.icon,
    typeTone: type.tone,
    statusLabel: status.label,
    statusTone: status.tone,
    originLabel: origin.label,
    originTone: origin.tone,
    fileLabel: file.label,
    fileIcon: file.icon,
    updatedLabel: `Updated ${formatRelativeDate(dto.updatedAt)}`,
    lastUsedLabel: dto.lastUsedAt ? `Used ${formatRelativeDate(dto.lastUsedAt)}` : "Not used yet",
    description: dto.description,
    tags: dto.tags,
    usageLabel: `${dto.usageCount} uses`,
    sizeLabel: dto.sizeLabel,
  };
}

export function toResourceDetailView(dto: ResourceDetailDto): ResourceDetailView {
  const card = toResourceCardView(dto);

  return {
    ...card,
    workspaceName: dto.workspace.name,
    ownerName: dto.ownerName ?? "Workspace library",
    classHref: dto.classHref,
    lessonPlanHref: dto.lessonPlanHref,
    assessmentHref: dto.assessmentHref,
    questionHref: dto.questionHref,
    externalUrl: dto.url,
  };
}

function toScopeLabel(dto: ResourceDto) {
  if (dto.visibility === "teacher") {
    return "Personal resource";
  }

  if (dto.visibility === "class") {
    return dto.classDisplayName ?? "Class resource";
  }

  return "Workspace-wide";
}

function formatRelativeDate(value: string) {
  const date = new Date(value);

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(date);
}

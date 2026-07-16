import type {
  ClassOverviewDto,
  ClassOverviewView,
  ClassesPageView,
  TeacherClassCardView,
  TeacherClassListItemDto,
  TeacherClassesResponseDto,
} from "@/lib/features/classes/types";

export function toClassesPageView(dto: TeacherClassesResponseDto): ClassesPageView {
  return {
    workspaceName: dto.workspace.name,
    academicSessionLabel: `${dto.workspace.academicYearName} - ${dto.workspace.termName}`,
    totalClasses: dto.classes.length,
    totalLearners: dto.classes.reduce((sum, item) => sum + item.learnerCount, 0),
    totalAttention: dto.classes.reduce((sum, item) => sum + item.attentionCount, 0),
    totalOpenTasks: dto.classes.reduce((sum, item) => sum + item.openTaskCount, 0),
    canCreateLessonPlan: dto.permissions.canCreateLessonPlan,
    canUseAi: dto.permissions.canUseAi,
    classes: dto.classes.map(toClassCardView),
  };
}

export function toClassCardView(dto: TeacherClassListItemDto): TeacherClassCardView {
  const statusTone = dto.attentionCount > 0 ? "review" : "approved";
  const statusLabel = dto.attentionCount > 0 ? "Needs follow-up" : "On track";

  return {
    id: dto.id,
    href: `/classes/${dto.id}`,
    title: dto.displayName,
    subject: dto.subjectName,
    grade: dto.gradeName,
    room: dto.room,
    learnerLabel: `${dto.learnerCount} learner${dto.learnerCount === 1 ? "" : "s"}`,
    readinessPercent: dto.readinessPercent,
    curriculumProgressPercent: dto.curriculumProgressPercent,
    statusLabel,
    statusTone,
    nextLessonLabel: `${dto.nextLesson.title} - ${dto.nextLesson.timeLabel}`,
    nextLessonTopic: dto.nextLesson.topic,
    supportLabel:
      dto.attentionCount > 0
        ? `${dto.attentionCount} learner${dto.attentionCount === 1 ? "" : "s"} need support`
        : "No urgent support flags",
  };
}

export function toClassOverviewView(dto: ClassOverviewDto): ClassOverviewView {
  return {
    id: dto.id,
    title: dto.displayName,
    subtitle: `${dto.gradeName} ${dto.subjectName}`,
    workspaceName: dto.workspace.name,
    academicSessionLabel: `${dto.academicYearName} - ${dto.termName}`,
    scheduleLabel: dto.scheduleLabel,
    room: dto.room,
    learnerCount: dto.learnerCount,
    readinessPercent: dto.readinessPercent,
    curriculumProgressPercent: dto.curriculumProgressPercent,
    attentionCount: dto.attentionCount,
    nextLessonTitle: dto.nextLesson.title,
    nextLessonMeta: dto.nextLesson.timeLabel,
    nextLessonTopic: dto.nextLesson.topic,
    currentUnit: dto.currentUnit,
    description: dto.description,
    assignedTeachers: dto.assignedTeachers,
    learners: dto.learners,
    tasks: dto.tasks,
    recentActivity: dto.recentActivity,
  };
}

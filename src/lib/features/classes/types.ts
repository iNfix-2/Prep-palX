export interface WorkspaceSummaryDto {
  id: string;
  name: string;
  academicYearName: string;
  termName: string;
}

export interface TeacherClassListItemDto {
  id: string;
  displayName: string;
  gradeName: string;
  subjectName: string;
  academicYearName: string;
  termName: string;
  room: string;
  scheduleLabel: string;
  learnerCount: number;
  readinessPercent: number;
  curriculumProgressPercent: number;
  attentionCount: number;
  openTaskCount: number;
  nextLesson: {
    title: string;
    timeLabel: string;
    topic: string;
  };
}

export interface TeacherClassesResponseDto {
  workspace: WorkspaceSummaryDto;
  permissions: {
    canManageClasses: boolean;
    canCreateLessonPlan: boolean;
    canUseAi: boolean;
  };
  classes: TeacherClassListItemDto[];
}

export interface ClassLearnerDto {
  id: string;
  displayName: string;
  admissionNo: string;
  status: "on_track" | "needs_attention" | "excelling";
  lastScore: number;
  attendancePercent: number;
}

export interface ClassTaskDto {
  id: string;
  title: string;
  dueLabel: string;
  status: "open" | "review" | "done";
}

export interface ClassOverviewDto extends TeacherClassListItemDto {
  workspace: WorkspaceSummaryDto;
  description: string;
  currentUnit: string;
  assignedTeachers: string[];
  learners: ClassLearnerDto[];
  tasks: ClassTaskDto[];
  recentActivity: string[];
}

export interface TeacherClassCardView {
  id: string;
  href: string;
  title: string;
  subject: string;
  grade: string;
  room: string;
  learnerLabel: string;
  readinessPercent: number;
  curriculumProgressPercent: number;
  statusLabel: string;
  statusTone: "primary" | "review" | "approved";
  nextLessonLabel: string;
  nextLessonTopic: string;
  supportLabel: string;
}

export interface ClassesPageView {
  workspaceName: string;
  academicSessionLabel: string;
  totalClasses: number;
  totalLearners: number;
  totalAttention: number;
  totalOpenTasks: number;
  canCreateLessonPlan: boolean;
  canUseAi: boolean;
  classes: TeacherClassCardView[];
}

export interface ClassOverviewView {
  id: string;
  title: string;
  subtitle: string;
  workspaceName: string;
  academicSessionLabel: string;
  scheduleLabel: string;
  room: string;
  learnerCount: number;
  readinessPercent: number;
  curriculumProgressPercent: number;
  attentionCount: number;
  nextLessonTitle: string;
  nextLessonMeta: string;
  nextLessonTopic: string;
  currentUnit: string;
  description: string;
  assignedTeachers: string[];
  learners: ClassLearnerDto[];
  tasks: ClassTaskDto[];
  recentActivity: string[];
}

export interface ScheduleItem {
  time: string;
  title: string;
  detail: string;
  variant: "default" | "current" | "break";
}

export interface UrgentTask {
  title: string;
  detail: string;
  severity: "high" | "medium";
}

export interface CurriculumProgress {
  subject: string;
  percent: number;
  accent: "primary" | "neutral";
}

export interface RecentDocument {
  title: string;
  updatedLabel: string;
  icon: string;
}

export const teacherDashboardMock = {
  teacherName: "Mrs. Adeyemi",
  today: "Thursday, October 30",
  session: "2025/2026 Session • First Term",
  nextClass: {
    status: "Upcoming Now",
    time: "9:20 AM – 10:00 AM",
    subject: "Primary 4 Mathematics",
    topic: "Equivalent Fractions",
    location: "Primary 4 Classroom",
    learnerCount: 24,
  },
  schedule: [
    { time: "8:00 AM", title: "Staff Briefing", detail: "8:00 – 8:40 AM", variant: "default" },
    { time: "8:40 AM", title: "Fellowship", detail: "8:40 – 9:20 AM", variant: "default" },
    {
      time: "9:20 AM",
      title: "Primary 4 Mathematics",
      detail: "9:20 – 10:00 AM • Room 4B",
      variant: "current",
    },
    { time: "10:00 AM", title: "Recess Period", detail: "10:00 – 11:00 AM", variant: "break" },
    { time: "11:00 AM", title: "Primary 3 English", detail: "11:00 – 11:40 AM", variant: "default" },
    {
      time: "11:40 AM",
      title: "Science Practical",
      detail: "11:40 AM – 12:20 PM",
      variant: "default",
    },
    {
      time: "12:20 PM",
      title: "Lesson Wrap-up/Planning",
      detail: "12:20 – 1:00 PM",
      variant: "default",
    },
  ] satisfies ScheduleItem[],
  palInsight: {
    message: "Four learners struggled with improper fractions in yesterday's quiz.",
    actionLabel: "Generate revision exercise",
  },
  urgentTasks: [
    {
      title: "Primary 4 Mathematics CA draft is incomplete",
      detail: "Due today • 4:00 PM",
      severity: "high",
    },
    {
      title: "Primary 3 English scores due tomorrow",
      detail: "Term 1 Summary",
      severity: "medium",
    },
  ] satisfies UrgentTask[],
  curriculumProgress: [
    { subject: "P4 Mathematics", percent: 68, accent: "primary" },
    { subject: "P3 English", percent: 42, accent: "neutral" },
  ] satisfies CurriculumProgress[],
  recentDocuments: [
    { title: "Fractions Lesson", updatedLabel: "Edited 2h ago", icon: "description" },
    { title: "English CA Draft", updatedLabel: "Edited 4h ago", icon: "quiz" },
    { title: "Science Marking Guide", updatedLabel: "Edited Yesterday", icon: "grading" },
  ] satisfies RecentDocument[],
};

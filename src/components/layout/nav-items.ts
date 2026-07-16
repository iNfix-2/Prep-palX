export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export const teacherNavItems: NavItem[] = [
  { label: "Home", href: "/", icon: "home" },
  { label: "My Classes", href: "/classes", icon: "groups" },
  { label: "Lesson Planner", href: "/lesson-planner", icon: "auto_stories" },
  { label: "Assessments", href: "/assessments", icon: "assignment" },
  { label: "Question Bank", href: "/question-bank", icon: "database" },
  { label: "Timetable", href: "/timetable", icon: "calendar_view_day" },
  { label: "Academic Calendar", href: "/academic-calendar", icon: "calendar_month" },
  { label: "Gradebook", href: "/gradebook", icon: "grading" },
  { label: "Attendance", href: "/attendance", icon: "how_to_reg" },
  { label: "Resources", href: "/resources", icon: "folder_open" },
  { label: "Approvals", href: "/approvals", icon: "verified_user" },
  { label: "Reports", href: "/reports", icon: "analytics" },
  { label: "My Tasks", href: "/my-tasks", icon: "task_alt" },
  { label: "Ask Pal", href: "/ask-pal", icon: "smart_toy" },
  { label: "Help Centre", href: "/help", icon: "help" },
  { label: "Settings", href: "/settings", icon: "settings" },
];

import type { Permission } from "@/lib/security/permissions";

export type DemoRole = "teacher" | "admin";

export interface DemoUser {
  id: string;
  email: string;
  password: string;
  displayName: string;
  shortName: string;
}

export interface DemoWorkspace {
  id: string;
  name: string;
  slug: string;
  type: "school";
  currentAcademicYearId: string;
  currentAcademicYearName: string;
  currentTermId: string;
  currentTermName: string;
}

export interface DemoMembership {
  id: string;
  userId: string;
  workspaceId: string;
  role: DemoRole;
  roleName: string;
  jobTitle: string;
  permissions: Permission[];
}

export interface DemoSession {
  token: string;
  userId: string;
}

export interface DemoLearner {
  id: string;
  workspaceId: string;
  displayName: string;
  admissionNo: string;
  status: "on_track" | "needs_attention" | "excelling";
  lastScore: number;
  attendancePercent: number;
}

export type DemoAttendanceStatus = "present" | "absent" | "late" | "excused";

export interface DemoAttendanceRecord {
  id: string;
  workspaceId: string;
  classId: string;
  learnerId: string;
  date: string;
  status: DemoAttendanceStatus;
  note?: string;
  markedByMembershipId: string;
  updatedAt: string;
}

export interface DemoClassTask {
  id: string;
  title: string;
  dueLabel: string;
  status: "open" | "review" | "done";
}

export interface DemoClass {
  id: string;
  workspaceId: string;
  displayName: string;
  gradeName: string;
  subjectName: string;
  academicYearId: string;
  academicYearName: string;
  termId: string;
  termName: string;
  room: string;
  scheduleLabel: string;
  currentUnit: string;
  description: string;
  nextLessonTitle: string;
  nextLessonTimeLabel: string;
  nextLessonTopic: string;
  assignedMembershipIds: string[];
  learnerIds: string[];
  readinessPercent: number;
  curriculumProgressPercent: number;
  attentionCount: number;
  tasks: DemoClassTask[];
  recentActivity: string[];
}

export const demoUsers: DemoUser[] = [
  {
    id: "user-ade",
    email: "mrs.adeyemi@truth.test",
    password: "password",
    displayName: "Mrs. Adeyemi",
    shortName: "Adeyemi",
  },
  {
    id: "user-admin-truth",
    email: "admin@truth.test",
    password: "password",
    displayName: "Mr. Okafor",
    shortName: "Okafor",
  },
  {
    id: "user-river",
    email: "river.teacher@truth.test",
    password: "password",
    displayName: "Ms. Bello",
    shortName: "Bello",
  },
];

export const demoWorkspaces: DemoWorkspace[] = [
  {
    id: "school-truth",
    name: "Truth International School",
    slug: "truth-international",
    type: "school",
    currentAcademicYearId: "ay-2026-2027",
    currentAcademicYearName: "2026/2027",
    currentTermId: "term-1",
    currentTermName: "First Term",
  },
  {
    id: "school-river",
    name: "River Gate School",
    slug: "river-gate",
    type: "school",
    currentAcademicYearId: "ay-2026-2027",
    currentAcademicYearName: "2026/2027",
    currentTermId: "term-1",
    currentTermName: "First Term",
  },
];

export const demoMemberships: DemoMembership[] = [
  {
    id: "mem-truth-teacher-ade",
    userId: "user-ade",
    workspaceId: "school-truth",
    role: "teacher",
    roleName: "Teacher",
    jobTitle: "Lead Teacher",
    permissions: [
      "dashboard.view",
      "workspace.select",
      "class.view_assigned",
      "attendance.record",
      "attendance.view_reports",
      "lesson.create",
      "assessment.create",
      "ai.use",
    ],
  },
  {
    id: "mem-truth-admin",
    userId: "user-admin-truth",
    workspaceId: "school-truth",
    role: "admin",
    roleName: "School Admin",
    jobTitle: "Academic Administrator",
    permissions: [
      "dashboard.view",
      "workspace.select",
      "class.view_assigned",
      "class.manage",
      "attendance.record",
      "attendance.view_reports",
      "lesson.create",
      "assessment.create",
      "ai.use",
    ],
  },
  {
    id: "mem-river-teacher",
    userId: "user-river",
    workspaceId: "school-river",
    role: "teacher",
    roleName: "Teacher",
    jobTitle: "Class Teacher",
    permissions: [
      "dashboard.view",
      "workspace.select",
      "class.view_assigned",
      "attendance.record",
      "lesson.create",
    ],
  },
];

export const demoSessions: DemoSession[] = [
  { token: "session-teacher-ade", userId: "user-ade" },
  { token: "session-admin-truth", userId: "user-admin-truth" },
  { token: "session-river-teacher", userId: "user-river" },
];

export const demoLearners: DemoLearner[] = [
  {
    id: "learner-ada",
    workspaceId: "school-truth",
    displayName: "Ada Hassan",
    admissionNo: "TIS-0401",
    status: "excelling",
    lastScore: 92,
    attendancePercent: 98,
  },
  {
    id: "learner-tomi",
    workspaceId: "school-truth",
    displayName: "Tomi Falade",
    admissionNo: "TIS-0402",
    status: "on_track",
    lastScore: 78,
    attendancePercent: 94,
  },
  {
    id: "learner-kene",
    workspaceId: "school-truth",
    displayName: "Kene Ibe",
    admissionNo: "TIS-0403",
    status: "needs_attention",
    lastScore: 54,
    attendancePercent: 88,
  },
  {
    id: "learner-ife",
    workspaceId: "school-truth",
    displayName: "Ife Musa",
    admissionNo: "TIS-0307",
    status: "on_track",
    lastScore: 74,
    attendancePercent: 91,
  },
  {
    id: "learner-zara",
    workspaceId: "school-truth",
    displayName: "Zara Okonkwo",
    admissionNo: "TIS-0308",
    status: "needs_attention",
    lastScore: 49,
    attendancePercent: 84,
  },
  {
    id: "learner-uche",
    workspaceId: "school-truth",
    displayName: "Uche Nwosu",
    admissionNo: "TIS-0504",
    status: "on_track",
    lastScore: 71,
    attendancePercent: 93,
  },
  {
    id: "learner-maryam",
    workspaceId: "school-river",
    displayName: "Maryam Sani",
    admissionNo: "RGS-0201",
    status: "on_track",
    lastScore: 76,
    attendancePercent: 97,
  },
];

export const demoClasses: DemoClass[] = [
  {
    id: "class-p4-math",
    workspaceId: "school-truth",
    displayName: "Primary 4 Mathematics",
    gradeName: "Primary 4",
    subjectName: "Mathematics",
    academicYearId: "ay-2026-2027",
    academicYearName: "2026/2027",
    termId: "term-1",
    termName: "First Term",
    room: "Room 4B",
    scheduleLabel: "Mon, Wed, Fri - 9:20 AM",
    currentUnit: "Fractions and Factors",
    description:
      "Equivalent fractions, factors, and place-value reasoning for the current teaching cycle.",
    nextLessonTitle: "Equivalent Fractions",
    nextLessonTimeLabel: "Tomorrow, 9:20 AM",
    nextLessonTopic: "Representing equivalent fractions with visual models",
    assignedMembershipIds: ["mem-truth-teacher-ade"],
    learnerIds: ["learner-ada", "learner-tomi", "learner-kene"],
    readinessPercent: 68,
    curriculumProgressPercent: 54,
    attentionCount: 1,
    tasks: [
      {
        id: "task-p4-revision",
        title: "Assign revision exercise to support group",
        dueLabel: "Due today",
        status: "open",
      },
      {
        id: "task-p4-scores",
        title: "Review quick-check scores",
        dueLabel: "Due tomorrow",
        status: "review",
      },
    ],
    recentActivity: [
      "Quick-check results imported 2 hours ago.",
      "Pal flagged one learner for fractions remediation.",
      "Lesson draft updated from the curriculum pacing guide.",
    ],
  },
  {
    id: "class-p3-english",
    workspaceId: "school-truth",
    displayName: "Primary 3 English",
    gradeName: "Primary 3",
    subjectName: "English",
    academicYearId: "ay-2026-2027",
    academicYearName: "2026/2027",
    termId: "term-1",
    termName: "First Term",
    room: "Room 3A",
    scheduleLabel: "Tue, Thu - 11:00 AM",
    currentUnit: "Reading for Meaning",
    description:
      "Comprehension, vocabulary, and short written responses linked to the term reader.",
    nextLessonTitle: "Main Idea in Short Passages",
    nextLessonTimeLabel: "Today, 11:00 AM",
    nextLessonTopic: "Finding evidence for the main idea",
    assignedMembershipIds: ["mem-truth-teacher-ade"],
    learnerIds: ["learner-ife", "learner-zara"],
    readinessPercent: 42,
    curriculumProgressPercent: 47,
    attentionCount: 1,
    tasks: [
      {
        id: "task-p3-comprehension",
        title: "Enter comprehension scores",
        dueLabel: "Due today",
        status: "open",
      },
    ],
    recentActivity: [
      "Two comprehension scripts are pending score entry.",
      "Guardian follow-up suggested for attendance pattern.",
    ],
  },
  {
    id: "class-p5-science",
    workspaceId: "school-truth",
    displayName: "Primary 5 Basic Science",
    gradeName: "Primary 5",
    subjectName: "Basic Science",
    academicYearId: "ay-2026-2027",
    academicYearName: "2026/2027",
    termId: "term-1",
    termName: "First Term",
    room: "Lab 1",
    scheduleLabel: "Mon, Thu - 1:20 PM",
    currentUnit: "Matter and Change",
    description:
      "Lab observation, evaporation, and condensation activities for the science practical block.",
    nextLessonTitle: "Evaporation Practical",
    nextLessonTimeLabel: "Monday, 1:20 PM",
    nextLessonTopic: "Observing changes of state safely",
    assignedMembershipIds: ["mem-truth-admin"],
    learnerIds: ["learner-uche"],
    readinessPercent: 91,
    curriculumProgressPercent: 62,
    attentionCount: 0,
    tasks: [
      {
        id: "task-p5-lab",
        title: "Confirm lab resources",
        dueLabel: "Done",
        status: "done",
      },
    ],
    recentActivity: [
      "Practical guide approved for Monday.",
      "Lab resource checklist completed.",
    ],
  },
  {
    id: "class-river-history",
    workspaceId: "school-river",
    displayName: "Primary 2 Social Studies",
    gradeName: "Primary 2",
    subjectName: "Social Studies",
    academicYearId: "ay-2026-2027",
    academicYearName: "2026/2027",
    termId: "term-1",
    termName: "First Term",
    room: "Room 2C",
    scheduleLabel: "Wed - 10:30 AM",
    currentUnit: "Community Helpers",
    description: "A separate tenant class used to verify tenant isolation.",
    nextLessonTitle: "Who Helps in Our Community?",
    nextLessonTimeLabel: "Wednesday, 10:30 AM",
    nextLessonTopic: "Roles and responsibilities",
    assignedMembershipIds: ["mem-river-teacher"],
    learnerIds: ["learner-maryam"],
    readinessPercent: 73,
    curriculumProgressPercent: 41,
    attentionCount: 0,
    tasks: [],
    recentActivity: ["Tenant isolation fixture."],
  },
];

export const DEMO_TODAY = "2026-07-16";

export const demoAttendanceRecords: DemoAttendanceRecord[] = [
  {
    id: "attendance-p4-ada-today",
    workspaceId: "school-truth",
    classId: "class-p4-math",
    learnerId: "learner-ada",
    date: DEMO_TODAY,
    status: "present",
    markedByMembershipId: "mem-truth-teacher-ade",
    updatedAt: "2026-07-16T08:45:00.000Z",
  },
  {
    id: "attendance-p4-tomi-today",
    workspaceId: "school-truth",
    classId: "class-p4-math",
    learnerId: "learner-tomi",
    date: DEMO_TODAY,
    status: "late",
    note: "Arrived after staff briefing.",
    markedByMembershipId: "mem-truth-teacher-ade",
    updatedAt: "2026-07-16T08:46:00.000Z",
  },
  {
    id: "attendance-p4-kene-today",
    workspaceId: "school-truth",
    classId: "class-p4-math",
    learnerId: "learner-kene",
    date: DEMO_TODAY,
    status: "absent",
    note: "Guardian follow-up needed.",
    markedByMembershipId: "mem-truth-teacher-ade",
    updatedAt: "2026-07-16T08:47:00.000Z",
  },
  {
    id: "attendance-p3-ife-today",
    workspaceId: "school-truth",
    classId: "class-p3-english",
    learnerId: "learner-ife",
    date: DEMO_TODAY,
    status: "present",
    markedByMembershipId: "mem-truth-teacher-ade",
    updatedAt: "2026-07-16T09:20:00.000Z",
  },
  {
    id: "attendance-p5-uche-today",
    workspaceId: "school-truth",
    classId: "class-p5-science",
    learnerId: "learner-uche",
    date: DEMO_TODAY,
    status: "present",
    markedByMembershipId: "mem-truth-admin",
    updatedAt: "2026-07-16T09:10:00.000Z",
  },
  {
    id: "attendance-river-maryam-today",
    workspaceId: "school-river",
    classId: "class-river-history",
    learnerId: "learner-maryam",
    date: DEMO_TODAY,
    status: "present",
    markedByMembershipId: "mem-river-teacher",
    updatedAt: "2026-07-16T09:00:00.000Z",
  },
];

export function findDemoUserBySession(token: string | undefined) {
  const session = demoSessions.find((item) => item.token === token);
  return session ? demoUsers.find((user) => user.id === session.userId) ?? null : null;
}

export function authenticateDemoUser(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = demoUsers.find(
    (candidate) =>
      candidate.email.toLowerCase() === normalizedEmail && candidate.password === password,
  );

  if (!user) {
    return null;
  }

  const session = demoSessions.find((item) => item.userId === user.id);
  return session ? { user, session } : null;
}

export function listMembershipsForUser(userId: string) {
  return demoMemberships.filter((membership) => membership.userId === userId);
}

export function getWorkspace(workspaceId: string) {
  return demoWorkspaces.find((workspace) => workspace.id === workspaceId) ?? null;
}

export function getMembership(userId: string, workspaceId: string) {
  return (
    demoMemberships.find(
      (membership) => membership.userId === userId && membership.workspaceId === workspaceId,
    ) ?? null
  );
}

export function getDefaultWorkspaceForUser(userId: string) {
  const membership = listMembershipsForUser(userId)[0];
  return membership ? getWorkspace(membership.workspaceId) : null;
}

export function toPublicUser(user: DemoUser) {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    shortName: user.shortName,
  };
}

export function getAttendanceRecordsForClass(classId: string, date: string) {
  return demoAttendanceRecords.filter(
    (record) => record.classId === classId && record.date === date,
  );
}

export function upsertDemoAttendanceRecords(
  records: Array<{
    workspaceId: string;
    classId: string;
    learnerId: string;
    date: string;
    status: DemoAttendanceStatus;
    note?: string;
    markedByMembershipId: string;
  }>,
) {
  const updatedAt = new Date().toISOString();

  for (const record of records) {
    const existing = demoAttendanceRecords.find(
      (candidate) =>
        candidate.classId === record.classId &&
        candidate.learnerId === record.learnerId &&
        candidate.date === record.date,
    );

    if (existing) {
      existing.status = record.status;
      existing.note = record.note;
      existing.markedByMembershipId = record.markedByMembershipId;
      existing.updatedAt = updatedAt;
      continue;
    }

    demoAttendanceRecords.push({
      id: `attendance-${record.classId}-${record.learnerId}-${record.date}`,
      ...record,
      updatedAt,
    });
  }
}

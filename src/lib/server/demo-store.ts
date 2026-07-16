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

export type DemoLessonPlanStatus = "draft" | "in_review" | "approved";

export interface DemoLessonPlan {
  id: string;
  workspaceId: string;
  classId: string;
  title: string;
  topic: string;
  status: DemoLessonPlanStatus;
  scheduledFor: string;
  durationMinutes: number;
  objectives: string[];
  materials: string[];
  starterActivity: string;
  teachingActivity: string;
  learnerPractice: string;
  assessmentCheck: string;
  differentiation: string;
  readinessPercent: number;
  createdByMembershipId: string;
  updatedAt: string;
}

export type DemoAssessmentStatus = "draft" | "in_review" | "published";
export type DemoAssessmentType = "classwork" | "quiz" | "continuous_assessment" | "exam";

export interface DemoAssessmentItem {
  id: string;
  prompt: string;
  marks: number;
  skill: string;
}

export interface DemoAssessment {
  id: string;
  workspaceId: string;
  classId: string;
  title: string;
  type: DemoAssessmentType;
  status: DemoAssessmentStatus;
  scheduledFor: string;
  dueDate: string;
  durationMinutes: number;
  totalMarks: number;
  topics: string[];
  instructions: string;
  items: DemoAssessmentItem[];
  reviewNotes: string;
  readinessPercent: number;
  createdByMembershipId: string;
  updatedAt: string;
}

export type DemoGradebookScoreStatus = "scored" | "missing" | "excused";

export interface DemoGradebookScore {
  id: string;
  workspaceId: string;
  assessmentId: string;
  classId: string;
  learnerId: string;
  score: number | null;
  maxScore: number;
  status: DemoGradebookScoreStatus;
  feedback: string;
  markedByMembershipId?: string;
  updatedAt: string;
}

export type DemoReportCommentStatus = "draft" | "ready";

export interface DemoReportComment {
  id: string;
  workspaceId: string;
  classId: string;
  learnerId: string;
  academicYearId: string;
  termId: string;
  comment: string;
  status: DemoReportCommentStatus;
  updatedByMembershipId: string;
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
      "lesson.view",
      "lesson.create",
      "assessment.view",
      "assessment.create",
      "assessment.mark",
      "gradebook.view",
      "report.prepare",
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
      "lesson.view",
      "lesson.create",
      "assessment.view",
      "assessment.create",
      "assessment.mark",
      "gradebook.view",
      "report.prepare",
      "report.review",
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
      "lesson.view",
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

export const demoLessonPlans: DemoLessonPlan[] = [
  {
    id: "lesson-p4-fractions",
    workspaceId: "school-truth",
    classId: "class-p4-math",
    title: "Equivalent Fractions",
    topic: "Representing equivalent fractions with visual models",
    status: "draft",
    scheduledFor: "2026-07-17",
    durationMinutes: 40,
    objectives: [
      "Identify equivalent fractions using fraction strips.",
      "Explain why two fractions can represent the same amount.",
    ],
    materials: ["Fraction strips", "Mini whiteboards", "Exit ticket"],
    starterActivity:
      "Learners match shaded fraction cards and explain one match to a partner.",
    teachingActivity:
      "Model equivalent fractions with strips, then compare one-half, two-quarters, and three-sixths.",
    learnerPractice:
      "Pairs build three equivalent fractions and record the relationship in their notebooks.",
    assessmentCheck:
      "Exit ticket: draw a visual model that proves 2/4 is equivalent to 1/2.",
    differentiation:
      "Support group uses pre-cut strips; extension group writes one general rule.",
    readinessPercent: 72,
    createdByMembershipId: "mem-truth-teacher-ade",
    updatedAt: "2026-07-16T10:15:00.000Z",
  },
  {
    id: "lesson-p3-reading",
    workspaceId: "school-truth",
    classId: "class-p3-english",
    title: "Main Idea in Short Passages",
    topic: "Finding evidence for the main idea",
    status: "in_review",
    scheduledFor: "2026-07-18",
    durationMinutes: 35,
    objectives: [
      "State the main idea of a short passage.",
      "Underline one sentence that supports the main idea.",
    ],
    materials: ["Term reader", "Highlighters", "Comprehension worksheet"],
    starterActivity:
      "Read a three-sentence paragraph and choose the best title.",
    teachingActivity:
      "Think aloud while separating interesting details from the central idea.",
    learnerPractice:
      "Small groups annotate one passage and share their evidence.",
    assessmentCheck:
      "Collect one-sentence main idea responses before plenary.",
    differentiation:
      "Provide sentence frames for support group and an unseen passage for extension.",
    readinessPercent: 84,
    createdByMembershipId: "mem-truth-teacher-ade",
    updatedAt: "2026-07-16T11:00:00.000Z",
  },
  {
    id: "lesson-p5-evaporation",
    workspaceId: "school-truth",
    classId: "class-p5-science",
    title: "Evaporation Practical",
    topic: "Observing changes of state safely",
    status: "approved",
    scheduledFor: "2026-07-20",
    durationMinutes: 45,
    objectives: [
      "Describe evaporation as a change from liquid to gas.",
      "Record observations from a safe practical activity.",
    ],
    materials: ["Water trays", "Heat source", "Safety checklist"],
    starterActivity:
      "Learners predict what will happen to water left in the sun.",
    teachingActivity:
      "Demonstrate the practical setup and reinforce safety expectations.",
    learnerPractice:
      "Groups observe, record, and compare water levels after heating.",
    assessmentCheck:
      "Learners write one observation and one conclusion.",
    differentiation:
      "Provide observation prompts for support learners.",
    readinessPercent: 100,
    createdByMembershipId: "mem-truth-admin",
    updatedAt: "2026-07-15T13:30:00.000Z",
  },
  {
    id: "lesson-river-community",
    workspaceId: "school-river",
    classId: "class-river-history",
    title: "Community Helpers",
    topic: "Roles and responsibilities in the community",
    status: "draft",
    scheduledFor: "2026-07-18",
    durationMinutes: 30,
    objectives: ["Name three community helpers.", "Explain how one helper supports families."],
    materials: ["Picture cards", "Role-play prompts"],
    starterActivity: "Learners identify helper pictures.",
    teachingActivity: "Discuss helper roles with picture prompts.",
    learnerPractice: "Learners role-play a community helper.",
    assessmentCheck: "Learners complete one helper sentence.",
    differentiation: "Use picture prompts for emerging readers.",
    readinessPercent: 68,
    createdByMembershipId: "mem-river-teacher",
    updatedAt: "2026-07-16T09:00:00.000Z",
  },
];

export const demoAssessments: DemoAssessment[] = [
  {
    id: "assessment-p4-fractions",
    workspaceId: "school-truth",
    classId: "class-p4-math",
    title: "Fractions Quick Check",
    type: "quiz",
    status: "draft",
    scheduledFor: "2026-07-22",
    dueDate: "2026-07-22",
    durationMinutes: 25,
    totalMarks: 20,
    topics: ["Equivalent fractions", "Visual models", "Comparing fractions"],
    instructions:
      "Learners answer independently. Allow fraction strips for the first two questions only.",
    items: [
      {
        id: "assessment-p4-fractions-item-1",
        prompt: "Shade a model that proves 2/4 is equivalent to 1/2.",
        marks: 6,
        skill: "Representation",
      },
      {
        id: "assessment-p4-fractions-item-2",
        prompt: "Circle the fraction equivalent to 3/6 and explain your choice.",
        marks: 6,
        skill: "Reasoning",
      },
      {
        id: "assessment-p4-fractions-item-3",
        prompt: "Order 1/2, 3/4, and 2/3 from least to greatest.",
        marks: 8,
        skill: "Comparison",
      },
    ],
    reviewNotes:
      "Check whether Kene needs a visual support item before this moves to review.",
    readinessPercent: 82,
    createdByMembershipId: "mem-truth-teacher-ade",
    updatedAt: "2026-07-16T12:10:00.000Z",
  },
  {
    id: "assessment-p3-comprehension",
    workspaceId: "school-truth",
    classId: "class-p3-english",
    title: "Main Idea Exit Assessment",
    type: "classwork",
    status: "in_review",
    scheduledFor: "2026-07-23",
    dueDate: "2026-07-23",
    durationMinutes: 30,
    totalMarks: 15,
    topics: ["Main idea", "Supporting evidence", "Short response"],
    instructions:
      "Read the short passage twice, underline evidence, then write one clear main idea sentence.",
    items: [
      {
        id: "assessment-p3-comprehension-item-1",
        prompt: "Underline one sentence that supports the main idea.",
        marks: 5,
        skill: "Evidence",
      },
      {
        id: "assessment-p3-comprehension-item-2",
        prompt: "Write the main idea in one complete sentence.",
        marks: 6,
        skill: "Comprehension",
      },
      {
        id: "assessment-p3-comprehension-item-3",
        prompt: "Choose the best title for the passage.",
        marks: 4,
        skill: "Summary",
      },
    ],
    reviewNotes: "Reviewer should confirm the passage vocabulary is accessible.",
    readinessPercent: 93,
    createdByMembershipId: "mem-truth-teacher-ade",
    updatedAt: "2026-07-16T12:45:00.000Z",
  },
  {
    id: "assessment-p5-matter",
    workspaceId: "school-truth",
    classId: "class-p5-science",
    title: "Matter and Change Practical Evidence",
    type: "continuous_assessment",
    status: "published",
    scheduledFor: "2026-07-24",
    dueDate: "2026-07-24",
    durationMinutes: 40,
    totalMarks: 25,
    topics: ["Evaporation", "Observation", "Conclusion"],
    instructions:
      "Learners record observations during the practical and write a short conclusion.",
    items: [
      {
        id: "assessment-p5-matter-item-1",
        prompt: "Record two observations from the evaporation setup.",
        marks: 10,
        skill: "Observation",
      },
      {
        id: "assessment-p5-matter-item-2",
        prompt: "Explain what changed and why.",
        marks: 10,
        skill: "Scientific explanation",
      },
      {
        id: "assessment-p5-matter-item-3",
        prompt: "List one safety rule followed during the practical.",
        marks: 5,
        skill: "Safety",
      },
    ],
    reviewNotes: "Admin-owned fixture for class-scope checks.",
    readinessPercent: 100,
    createdByMembershipId: "mem-truth-admin",
    updatedAt: "2026-07-15T15:30:00.000Z",
  },
  {
    id: "assessment-river-community",
    workspaceId: "school-river",
    classId: "class-river-history",
    title: "Community Helpers Check",
    type: "quiz",
    status: "draft",
    scheduledFor: "2026-07-22",
    dueDate: "2026-07-22",
    durationMinutes: 20,
    totalMarks: 10,
    topics: ["Community helpers"],
    instructions: "Learners match helpers to the service they provide.",
    items: [
      {
        id: "assessment-river-community-item-1",
        prompt: "Name two community helpers and their jobs.",
        marks: 10,
        skill: "Recall",
      },
    ],
    reviewNotes: "Tenant isolation fixture.",
    readinessPercent: 70,
    createdByMembershipId: "mem-river-teacher",
    updatedAt: "2026-07-16T10:30:00.000Z",
  },
];

export const demoGradebookScores: DemoGradebookScore[] = [
  {
    id: "score-p4-fractions-ada",
    workspaceId: "school-truth",
    assessmentId: "assessment-p4-fractions",
    classId: "class-p4-math",
    learnerId: "learner-ada",
    score: 18,
    maxScore: 20,
    status: "scored",
    feedback: "Secure visual model and explanation.",
    markedByMembershipId: "mem-truth-teacher-ade",
    updatedAt: "2026-07-16T13:10:00.000Z",
  },
  {
    id: "score-p4-fractions-tomi",
    workspaceId: "school-truth",
    assessmentId: "assessment-p4-fractions",
    classId: "class-p4-math",
    learnerId: "learner-tomi",
    score: 15,
    maxScore: 20,
    status: "scored",
    feedback: "Good comparison work; revisit explanation sentence.",
    markedByMembershipId: "mem-truth-teacher-ade",
    updatedAt: "2026-07-16T13:12:00.000Z",
  },
  {
    id: "score-p4-fractions-kene",
    workspaceId: "school-truth",
    assessmentId: "assessment-p4-fractions",
    classId: "class-p4-math",
    learnerId: "learner-kene",
    score: null,
    maxScore: 20,
    status: "missing",
    feedback: "Absent for quick check; needs catch-up.",
    markedByMembershipId: "mem-truth-teacher-ade",
    updatedAt: "2026-07-16T13:14:00.000Z",
  },
  {
    id: "score-p3-comprehension-ife",
    workspaceId: "school-truth",
    assessmentId: "assessment-p3-comprehension",
    classId: "class-p3-english",
    learnerId: "learner-ife",
    score: 11,
    maxScore: 15,
    status: "scored",
    feedback: "Clear main idea; add stronger evidence.",
    markedByMembershipId: "mem-truth-teacher-ade",
    updatedAt: "2026-07-16T13:30:00.000Z",
  },
  {
    id: "score-p3-comprehension-zara",
    workspaceId: "school-truth",
    assessmentId: "assessment-p3-comprehension",
    classId: "class-p3-english",
    learnerId: "learner-zara",
    score: null,
    maxScore: 15,
    status: "missing",
    feedback: "Script pending.",
    markedByMembershipId: "mem-truth-teacher-ade",
    updatedAt: "2026-07-16T13:32:00.000Z",
  },
  {
    id: "score-p5-matter-uche",
    workspaceId: "school-truth",
    assessmentId: "assessment-p5-matter",
    classId: "class-p5-science",
    learnerId: "learner-uche",
    score: 22,
    maxScore: 25,
    status: "scored",
    feedback: "Strong observation record and safe practical habits.",
    markedByMembershipId: "mem-truth-admin",
    updatedAt: "2026-07-15T16:00:00.000Z",
  },
  {
    id: "score-river-community-maryam",
    workspaceId: "school-river",
    assessmentId: "assessment-river-community",
    classId: "class-river-history",
    learnerId: "learner-maryam",
    score: 8,
    maxScore: 10,
    status: "scored",
    feedback: "Tenant isolation fixture.",
    markedByMembershipId: "mem-river-teacher",
    updatedAt: "2026-07-16T11:00:00.000Z",
  },
];

export const demoReportComments: DemoReportComment[] = [
  {
    id: "report-comment-p4-ada",
    workspaceId: "school-truth",
    classId: "class-p4-math",
    learnerId: "learner-ada",
    academicYearId: "ay-2026-2027",
    termId: "term-1",
    comment:
      "Ada works confidently with visual fraction models and explains her thinking clearly.",
    status: "ready",
    updatedByMembershipId: "mem-truth-teacher-ade",
    updatedAt: "2026-07-16T14:00:00.000Z",
  },
  {
    id: "report-comment-p4-tomi",
    workspaceId: "school-truth",
    classId: "class-p4-math",
    learnerId: "learner-tomi",
    academicYearId: "ay-2026-2027",
    termId: "term-1",
    comment:
      "Tomi is making steady progress and should keep practising written explanations.",
    status: "draft",
    updatedByMembershipId: "mem-truth-teacher-ade",
    updatedAt: "2026-07-16T14:05:00.000Z",
  },
  {
    id: "report-comment-p3-ife",
    workspaceId: "school-truth",
    classId: "class-p3-english",
    learnerId: "learner-ife",
    academicYearId: "ay-2026-2027",
    termId: "term-1",
    comment:
      "Ife reads with growing confidence and can identify the main idea in familiar texts.",
    status: "ready",
    updatedByMembershipId: "mem-truth-teacher-ade",
    updatedAt: "2026-07-16T14:20:00.000Z",
  },
  {
    id: "report-comment-p5-uche",
    workspaceId: "school-truth",
    classId: "class-p5-science",
    learnerId: "learner-uche",
    academicYearId: "ay-2026-2027",
    termId: "term-1",
    comment:
      "Uche records practical observations carefully and follows lab routines responsibly.",
    status: "ready",
    updatedByMembershipId: "mem-truth-admin",
    updatedAt: "2026-07-15T16:30:00.000Z",
  },
  {
    id: "report-comment-river-maryam",
    workspaceId: "school-river",
    classId: "class-river-history",
    learnerId: "learner-maryam",
    academicYearId: "ay-2026-2027",
    termId: "term-1",
    comment: "Tenant isolation fixture.",
    status: "draft",
    updatedByMembershipId: "mem-river-teacher",
    updatedAt: "2026-07-16T12:00:00.000Z",
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

export function getGradebookScoresForAssessment(assessmentId: string) {
  return demoGradebookScores.filter((record) => record.assessmentId === assessmentId);
}

export function getReportCommentsForClass(classId: string) {
  return demoReportComments.filter((record) => record.classId === classId);
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

export function upsertDemoGradebookScores(
  records: Array<{
    workspaceId: string;
    assessmentId: string;
    classId: string;
    learnerId: string;
    score: number | null;
    maxScore: number;
    status: DemoGradebookScoreStatus;
    feedback: string;
    markedByMembershipId: string;
  }>,
) {
  const updatedAt = new Date().toISOString();

  for (const record of records) {
    const existing = demoGradebookScores.find(
      (candidate) =>
        candidate.assessmentId === record.assessmentId &&
        candidate.learnerId === record.learnerId,
    );

    if (existing) {
      existing.score = record.score;
      existing.maxScore = record.maxScore;
      existing.status = record.status;
      existing.feedback = record.feedback;
      existing.markedByMembershipId = record.markedByMembershipId;
      existing.updatedAt = updatedAt;
      continue;
    }

    demoGradebookScores.push({
      id: `score-${record.assessmentId}-${record.learnerId}`,
      ...record,
      updatedAt,
    });
  }
}

export function upsertDemoReportComments(
  comments: Array<{
    workspaceId: string;
    classId: string;
    learnerId: string;
    academicYearId: string;
    termId: string;
    comment: string;
    status: DemoReportCommentStatus;
    updatedByMembershipId: string;
  }>,
) {
  const updatedAt = new Date().toISOString();

  for (const comment of comments) {
    const existing = demoReportComments.find(
      (candidate) =>
        candidate.classId === comment.classId &&
        candidate.learnerId === comment.learnerId &&
        candidate.academicYearId === comment.academicYearId &&
        candidate.termId === comment.termId,
    );

    if (existing) {
      existing.comment = comment.comment;
      existing.status = comment.status;
      existing.updatedByMembershipId = comment.updatedByMembershipId;
      existing.updatedAt = updatedAt;
      continue;
    }

    demoReportComments.push({
      id: `report-comment-${comment.classId}-${comment.learnerId}`,
      ...comment,
      updatedAt,
    });
  }
}

export function createDemoLessonPlan(
  input: Omit<DemoLessonPlan, "id" | "updatedAt" | "readinessPercent" | "status"> & {
    status?: DemoLessonPlanStatus;
    readinessPercent?: number;
  },
) {
  const lessonPlan: DemoLessonPlan = {
    ...input,
    id: `lesson-plan-${demoLessonPlans.length + 1}`,
    status: input.status ?? "draft",
    readinessPercent: input.readinessPercent ?? calculateLessonReadiness(input),
    updatedAt: new Date().toISOString(),
  };

  demoLessonPlans.push(lessonPlan);
  return lessonPlan;
}

export function createDemoAssessment(
  input: Omit<DemoAssessment, "id" | "updatedAt" | "readinessPercent" | "status"> & {
    status?: DemoAssessmentStatus;
    readinessPercent?: number;
  },
) {
  const assessment: DemoAssessment = {
    ...input,
    id: `assessment-${demoAssessments.length + 1}`,
    status: input.status ?? "draft",
    readinessPercent: input.readinessPercent ?? calculateAssessmentReadiness(input),
    updatedAt: new Date().toISOString(),
  };

  demoAssessments.push(assessment);
  return assessment;
}

function calculateLessonReadiness(input: {
  objectives: string[];
  materials: string[];
  starterActivity: string;
  teachingActivity: string;
  learnerPractice: string;
  assessmentCheck: string;
  differentiation: string;
}) {
  const checks = [
    input.objectives.length > 0,
    input.materials.length > 0,
    input.starterActivity.length > 0,
    input.teachingActivity.length > 0,
    input.learnerPractice.length > 0,
    input.assessmentCheck.length > 0,
    input.differentiation.length > 0,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function calculateAssessmentReadiness(input: {
  title: string;
  type: DemoAssessmentType;
  scheduledFor: string;
  dueDate: string;
  durationMinutes: number;
  totalMarks: number;
  topics: string[];
  instructions: string;
  items: DemoAssessmentItem[];
  reviewNotes: string;
}) {
  const itemMarks = input.items.reduce((sum, item) => sum + item.marks, 0);
  const checks = [
    input.title.length > 0,
    input.type.length > 0,
    input.scheduledFor.length > 0,
    input.dueDate.length > 0,
    input.durationMinutes >= 10,
    input.totalMarks > 0 && itemMarks === input.totalMarks,
    input.topics.length > 0,
    input.instructions.length > 0,
    input.items.length > 0,
    input.reviewNotes.length > 0,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

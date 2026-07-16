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

export type DemoQuestionStatus = "draft" | "in_review" | "approved";
export type DemoQuestionDifficulty = "easy" | "medium" | "hard";
export type DemoQuestionType = "multiple_choice" | "short_answer" | "structured_response";

export interface DemoQuestion {
  id: string;
  workspaceId: string;
  classId: string;
  prompt: string;
  type: DemoQuestionType;
  difficulty: DemoQuestionDifficulty;
  status: DemoQuestionStatus;
  marks: number;
  topic: string;
  skill: string;
  options: string[];
  answer: string;
  explanation: string;
  usageCount: number;
  qualityPercent: number;
  createdByMembershipId: string;
  updatedAt: string;
}

export type DemoTimetableEventType = "lesson" | "assessment" | "duty" | "meeting";
export type DemoTimetableEventStatus = "scheduled" | "in_progress" | "completed" | "conflict";
export type DemoTimetablePreparationStatus = "ready" | "needs_preparation" | "blocked";

export interface DemoTimetableEvent {
  id: string;
  workspaceId: string;
  classId?: string;
  title: string;
  type: DemoTimetableEventType;
  status: DemoTimetableEventStatus;
  preparationStatus: DemoTimetablePreparationStatus;
  startAt: string;
  endAt: string;
  location: string;
  notes: string;
  teacherMembershipId: string;
  linkedLessonPlanId?: string;
  linkedAssessmentId?: string;
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

export type DemoApprovalResourceType = "lesson_plan" | "assessment" | "report";
export type DemoApprovalStatus = "pending" | "changes_requested" | "approved";
export type DemoApprovalPriority = "low" | "medium" | "high";

export interface DemoApprovalNote {
  id: string;
  authorMembershipId: string;
  body: string;
  createdAt: string;
}

export interface DemoApprovalRequest {
  id: string;
  workspaceId: string;
  classId: string;
  resourceType: DemoApprovalResourceType;
  resourceId: string;
  title: string;
  summary: string;
  status: DemoApprovalStatus;
  priority: DemoApprovalPriority;
  submittedByMembershipId: string;
  reviewerMembershipId?: string;
  submittedAt: string;
  dueDate: string;
  updatedAt: string;
  notes: DemoApprovalNote[];
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
      "timetable.view",
      "attendance.record",
      "attendance.view_reports",
      "lesson.view",
      "lesson.create",
      "assessment.view",
      "assessment.create",
      "assessment.mark",
      "question.view",
      "question.manage",
      "gradebook.view",
      "report.prepare",
      "approval.view",
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
      "timetable.view",
      "attendance.record",
      "attendance.view_reports",
      "lesson.view",
      "lesson.create",
      "assessment.view",
      "assessment.create",
      "assessment.mark",
      "question.view",
      "question.manage",
      "gradebook.view",
      "report.prepare",
      "report.review",
      "approval.view",
      "approval.review",
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
      "timetable.view",
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

export const demoQuestions: DemoQuestion[] = [
  {
    id: "question-p4-equivalent-fractions",
    workspaceId: "school-truth",
    classId: "class-p4-math",
    prompt: "Which fraction is equivalent to 1/2 when shown with equal-sized fraction strips?",
    type: "multiple_choice",
    difficulty: "medium",
    status: "approved",
    marks: 4,
    topic: "Equivalent fractions",
    skill: "Representation",
    options: ["1/4", "2/4", "3/4", "4/4"],
    answer: "2/4",
    explanation:
      "Two out of four equal parts cover the same amount as one out of two equal parts.",
    usageCount: 3,
    qualityPercent: 96,
    createdByMembershipId: "mem-truth-teacher-ade",
    updatedAt: "2026-07-16T12:20:00.000Z",
  },
  {
    id: "question-p3-main-idea",
    workspaceId: "school-truth",
    classId: "class-p3-english",
    prompt: "Read the short passage and write one sentence that states its main idea.",
    type: "short_answer",
    difficulty: "medium",
    status: "in_review",
    marks: 5,
    topic: "Main idea",
    skill: "Comprehension",
    options: [],
    answer: "A clear sentence that tells what the passage is mostly about.",
    explanation:
      "The response should name the central idea and avoid listing only one small detail.",
    usageCount: 1,
    qualityPercent: 88,
    createdByMembershipId: "mem-truth-teacher-ade",
    updatedAt: "2026-07-16T11:55:00.000Z",
  },
  {
    id: "question-p5-evaporation",
    workspaceId: "school-truth",
    classId: "class-p5-science",
    prompt: "Explain why water left in a shallow tray may disappear faster on a sunny day.",
    type: "structured_response",
    difficulty: "hard",
    status: "approved",
    marks: 6,
    topic: "Evaporation",
    skill: "Scientific explanation",
    options: [],
    answer:
      "Heat from the sun gives water particles more energy, so more particles escape into the air as water vapour.",
    explanation:
      "A strong answer links heat, particle energy, and change from liquid water to vapour.",
    usageCount: 2,
    qualityPercent: 94,
    createdByMembershipId: "mem-truth-admin",
    updatedAt: "2026-07-15T15:45:00.000Z",
  },
  {
    id: "question-river-community",
    workspaceId: "school-river",
    classId: "class-river-history",
    prompt: "Name one community helper and describe how that person supports families.",
    type: "short_answer",
    difficulty: "easy",
    status: "draft",
    marks: 3,
    topic: "Community helpers",
    skill: "Recall",
    options: [],
    answer: "Example: a nurse helps families by treating sick people.",
    explanation: "Tenant isolation fixture for question-bank scope checks.",
    usageCount: 0,
    qualityPercent: 72,
    createdByMembershipId: "mem-river-teacher",
    updatedAt: "2026-07-16T10:40:00.000Z",
  },
];

export const demoTimetableEvents: DemoTimetableEvent[] = [
  {
    id: "timetable-staff-briefing",
    workspaceId: "school-truth",
    title: "Morning Staff Briefing",
    type: "meeting",
    status: "completed",
    preparationStatus: "ready",
    startAt: "2026-07-16T07:45:00.000Z",
    endAt: "2026-07-16T08:05:00.000Z",
    location: "Staff Room",
    notes: "Daily notices, duty rota check, and assessment moderation reminders.",
    teacherMembershipId: "mem-truth-teacher-ade",
  },
  {
    id: "timetable-p4-fractions",
    workspaceId: "school-truth",
    classId: "class-p4-math",
    title: "Equivalent Fractions",
    type: "lesson",
    status: "scheduled",
    preparationStatus: "needs_preparation",
    startAt: "2026-07-16T09:20:00.000Z",
    endAt: "2026-07-16T10:00:00.000Z",
    location: "Room 4B",
    notes: "Bring fraction strips and reuse the exit-ticket misconception list.",
    teacherMembershipId: "mem-truth-teacher-ade",
    linkedLessonPlanId: "lesson-p4-fractions",
  },
  {
    id: "timetable-p3-reading",
    workspaceId: "school-truth",
    classId: "class-p3-english",
    title: "Main Idea in Short Passages",
    type: "lesson",
    status: "scheduled",
    preparationStatus: "ready",
    startAt: "2026-07-16T11:00:00.000Z",
    endAt: "2026-07-16T11:35:00.000Z",
    location: "Room 3A",
    notes: "Use the term reader passage and collect one exit response before plenary.",
    teacherMembershipId: "mem-truth-teacher-ade",
    linkedLessonPlanId: "lesson-p3-reading",
  },
  {
    id: "timetable-p4-quick-check",
    workspaceId: "school-truth",
    classId: "class-p4-math",
    title: "Fractions Quick Check Prep",
    type: "assessment",
    status: "scheduled",
    preparationStatus: "blocked",
    startAt: "2026-07-16T13:15:00.000Z",
    endAt: "2026-07-16T13:40:00.000Z",
    location: "Room 4B",
    notes: "Resolve one visual support item before the assessment moves to review.",
    teacherMembershipId: "mem-truth-teacher-ade",
    linkedAssessmentId: "assessment-p4-fractions",
  },
  {
    id: "timetable-p5-practical",
    workspaceId: "school-truth",
    classId: "class-p5-science",
    title: "Evaporation Practical Setup",
    type: "lesson",
    status: "scheduled",
    preparationStatus: "ready",
    startAt: "2026-07-16T14:00:00.000Z",
    endAt: "2026-07-16T14:45:00.000Z",
    location: "Lab 1",
    notes: "Admin-owned science event used for class-scope checks.",
    teacherMembershipId: "mem-truth-admin",
    linkedLessonPlanId: "lesson-p5-evaporation",
    linkedAssessmentId: "assessment-p5-matter",
  },
  {
    id: "timetable-river-community",
    workspaceId: "school-river",
    classId: "class-river-history",
    title: "Community Helpers",
    type: "lesson",
    status: "scheduled",
    preparationStatus: "ready",
    startAt: "2026-07-16T10:30:00.000Z",
    endAt: "2026-07-16T11:00:00.000Z",
    location: "Room 2C",
    notes: "Tenant isolation fixture for timetable scope checks.",
    teacherMembershipId: "mem-river-teacher",
    linkedLessonPlanId: "lesson-river-community",
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

export const demoApprovalRequests: DemoApprovalRequest[] = [
  {
    id: "approval-lesson-p3-reading",
    workspaceId: "school-truth",
    classId: "class-p3-english",
    resourceType: "lesson_plan",
    resourceId: "lesson-p3-reading",
    title: "Main Idea in Short Passages",
    summary: "Lesson plan review for evidence-focused reading comprehension.",
    status: "pending",
    priority: "medium",
    submittedByMembershipId: "mem-truth-teacher-ade",
    reviewerMembershipId: "mem-truth-admin",
    submittedAt: "2026-07-16T11:20:00.000Z",
    dueDate: "2026-07-18",
    updatedAt: "2026-07-16T11:20:00.000Z",
    notes: [],
  },
  {
    id: "approval-assessment-p3-comprehension",
    workspaceId: "school-truth",
    classId: "class-p3-english",
    resourceType: "assessment",
    resourceId: "assessment-p3-comprehension",
    title: "Main Idea Exit Assessment",
    summary: "Assessment moderation request before publishing to the gradebook.",
    status: "pending",
    priority: "high",
    submittedByMembershipId: "mem-truth-teacher-ade",
    reviewerMembershipId: "mem-truth-admin",
    submittedAt: "2026-07-16T13:00:00.000Z",
    dueDate: "2026-07-23",
    updatedAt: "2026-07-16T13:00:00.000Z",
    notes: [],
  },
  {
    id: "approval-report-p4-math",
    workspaceId: "school-truth",
    classId: "class-p4-math",
    resourceType: "report",
    resourceId: "class-p4-math",
    title: "Primary 4 Mathematics Reports",
    summary: "Report comments need final evidence checks before family delivery.",
    status: "changes_requested",
    priority: "high",
    submittedByMembershipId: "mem-truth-teacher-ade",
    reviewerMembershipId: "mem-truth-admin",
    submittedAt: "2026-07-16T14:30:00.000Z",
    dueDate: "2026-07-26",
    updatedAt: "2026-07-16T15:00:00.000Z",
    notes: [
      {
        id: "approval-note-report-p4-math-1",
        authorMembershipId: "mem-truth-admin",
        body: "Resolve Kene's missing quick-check score before approving final reports.",
        createdAt: "2026-07-16T15:00:00.000Z",
      },
    ],
  },
  {
    id: "approval-lesson-p5-evaporation",
    workspaceId: "school-truth",
    classId: "class-p5-science",
    resourceType: "lesson_plan",
    resourceId: "lesson-p5-evaporation",
    title: "Evaporation Practical",
    summary: "Admin-owned science practical already approved for teaching.",
    status: "approved",
    priority: "low",
    submittedByMembershipId: "mem-truth-admin",
    reviewerMembershipId: "mem-truth-admin",
    submittedAt: "2026-07-15T13:00:00.000Z",
    dueDate: "2026-07-20",
    updatedAt: "2026-07-15T13:30:00.000Z",
    notes: [
      {
        id: "approval-note-lesson-p5-evaporation-1",
        authorMembershipId: "mem-truth-admin",
        body: "Approved with lab safety checklist attached to the lesson plan.",
        createdAt: "2026-07-15T13:30:00.000Z",
      },
    ],
  },
  {
    id: "approval-assessment-river-community",
    workspaceId: "school-river",
    classId: "class-river-history",
    resourceType: "assessment",
    resourceId: "assessment-river-community",
    title: "Community Helpers Check",
    summary: "Tenant isolation fixture.",
    status: "pending",
    priority: "medium",
    submittedByMembershipId: "mem-river-teacher",
    submittedAt: "2026-07-16T10:45:00.000Z",
    dueDate: "2026-07-22",
    updatedAt: "2026-07-16T10:45:00.000Z",
    notes: [],
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

export function getApprovalRequest(approvalId: string) {
  return demoApprovalRequests.find((request) => request.id === approvalId) ?? null;
}

export function getQuestion(questionId: string) {
  return demoQuestions.find((question) => question.id === questionId) ?? null;
}

export function getTimetableEvent(eventId: string) {
  return demoTimetableEvents.find((event) => event.id === eventId) ?? null;
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

export function updateDemoApprovalRequest(
  approvalId: string,
  update: {
    status: DemoApprovalStatus;
    reviewerMembershipId: string;
    note?: string;
  },
) {
  const approval = getApprovalRequest(approvalId);

  if (!approval) {
    return null;
  }

  const updatedAt = new Date().toISOString();
  approval.status = update.status;
  approval.reviewerMembershipId = update.reviewerMembershipId;
  approval.updatedAt = updatedAt;

  if (update.note?.trim()) {
    approval.notes.push({
      id: `approval-note-${approval.id}-${approval.notes.length + 1}`,
      authorMembershipId: update.reviewerMembershipId,
      body: update.note.trim(),
      createdAt: updatedAt,
    });
  }

  if (approval.resourceType === "lesson_plan") {
    const lessonPlan = demoLessonPlans.find((plan) => plan.id === approval.resourceId);
    if (lessonPlan) {
      lessonPlan.status = update.status === "approved" ? "approved" : "draft";
      lessonPlan.updatedAt = updatedAt;
    }
  }

  if (approval.resourceType === "assessment") {
    const assessment = demoAssessments.find((item) => item.id === approval.resourceId);
    if (assessment) {
      assessment.status = update.status === "approved" ? "published" : "draft";
      assessment.updatedAt = updatedAt;
    }
  }

  return approval;
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

export function createDemoQuestion(
  input: Omit<DemoQuestion, "id" | "updatedAt" | "qualityPercent" | "usageCount"> & {
    qualityPercent?: number;
    usageCount?: number;
  },
) {
  const question: DemoQuestion = {
    ...input,
    id: `question-${demoQuestions.length + 1}`,
    usageCount: input.usageCount ?? 0,
    qualityPercent: input.qualityPercent ?? calculateQuestionQuality(input),
    updatedAt: new Date().toISOString(),
  };

  demoQuestions.push(question);
  return question;
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

function calculateQuestionQuality(input: {
  prompt: string;
  type: DemoQuestionType;
  difficulty: DemoQuestionDifficulty;
  status: DemoQuestionStatus;
  marks: number;
  topic: string;
  skill: string;
  options: string[];
  answer: string;
  explanation: string;
}) {
  const checks = [
    input.prompt.length >= 10,
    input.type.length > 0,
    input.difficulty.length > 0,
    input.status.length > 0,
    input.marks > 0,
    input.topic.length > 0,
    input.skill.length > 0,
    input.type !== "multiple_choice" || input.options.length >= 2,
    input.answer.length > 0,
    input.explanation.length > 0,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export type WorkspaceTone =
  | "ai"
  | "approved"
  | "changes"
  | "draft"
  | "error"
  | "neutral"
  | "primary"
  | "review";

export interface WorkspaceAction {
  label: string;
  icon: string;
  href?: string;
  variant?: "primary" | "ai" | "secondary";
}

export interface WorkspaceMetric {
  label: string;
  value: string;
  detail?: string;
  icon: string;
  tone: WorkspaceTone;
}

export interface WorkspaceRow {
  title: string;
  detail: string;
  icon: string;
  tone: WorkspaceTone;
  meta?: string;
  owner?: string;
  status?: string;
  statusTone?: WorkspaceTone;
  progress?: number;
  href?: string;
}

export interface WorkspacePanel {
  title: string;
  description?: string;
  rows: WorkspaceRow[];
  action?: WorkspaceAction;
}

export interface WorkspaceStep {
  title: string;
  description: string;
  icon: string;
  tone: WorkspaceTone;
}

export interface WorkspacePageConfig {
  title: string;
  eyebrow: string;
  description: string;
  actions: WorkspaceAction[];
  metrics: WorkspaceMetric[];
  segments?: string[];
  primaryPanel: WorkspacePanel;
  secondaryPanel: WorkspacePanel;
  palSuggestion?: string;
  workflow?: WorkspaceStep[];
}

export interface BuilderField {
  label: string;
  value: string;
  kind?: "input" | "textarea";
}

export interface BuilderPageConfig {
  title: string;
  eyebrow: string;
  description: string;
  backHref: string;
  fields: BuilderField[];
  outlineTitle: string;
  outline: Array<{ title: string; detail: string }>;
  checklist: string[];
  palReview: string;
}

export const workspacePages: Record<string, WorkspacePageConfig> = {
  classes: {
    title: "My Classes",
    eyebrow: "Teaching Load",
    description:
      "Track assigned classes, learner progress, lesson readiness, and open classroom tasks in one place.",
    actions: [
      { label: "Prepare Lesson", icon: "auto_stories", href: "/lesson-planner/new", variant: "primary" },
      { label: "Ask Pal", icon: "smart_toy", href: "/ask-pal", variant: "ai" },
    ],
    metrics: [
      { label: "Active Classes", value: "5", detail: "Across Primary 3-5", icon: "groups", tone: "primary" },
      { label: "Learners", value: "126", detail: "8 require attention", icon: "person_check", tone: "neutral" },
      { label: "Prepared", value: "82%", detail: "This week", icon: "task_alt", tone: "approved" },
      { label: "Open Tasks", value: "7", detail: "2 urgent", icon: "priority_high", tone: "review" },
    ],
    segments: ["All", "Primary 4", "Due This Week", "Needs Attention"],
    primaryPanel: {
      title: "Class Overview",
      description: "Current teaching groups and readiness indicators.",
      rows: [
        {
          title: "Primary 4 Mathematics",
          detail: "Equivalent Fractions is next; revision exercise pending for four learners.",
          icon: "calculate",
          tone: "primary",
          meta: "24 learners",
          owner: "Room 4B",
          status: "Upcoming",
          statusTone: "primary",
          progress: 68,
        },
        {
          title: "Primary 3 English",
          detail: "Comprehension scores need entry before tomorrow's report checkpoint.",
          icon: "description",
          tone: "review",
          meta: "28 learners",
          owner: "Room 3A",
          status: "Scores Due",
          statusTone: "review",
          progress: 42,
        },
        {
          title: "Primary 5 Basic Science",
          detail: "Practical guide and resource sheet are ready for peer review.",
          icon: "auto_stories",
          tone: "approved",
          meta: "31 learners",
          owner: "Lab 1",
          status: "Ready",
          statusTone: "approved",
          progress: 91,
        },
      ],
    },
    secondaryPanel: {
      title: "Class Actions",
      description: "Common teacher workflows for this workspace.",
      rows: [
        { title: "Update learner groups", detail: "Rebalance support groups after CA results.", icon: "groups", tone: "primary", meta: "Suggested" },
        { title: "Message guardians", detail: "Follow up with guardians for absent learners.", icon: "link", tone: "neutral", meta: "3 contacts" },
        { title: "Generate revision pack", detail: "Use Pal to create differentiated practice.", icon: "smart_toy", tone: "ai", href: "/ask-pal" },
      ],
    },
    palSuggestion:
      "Primary 4 Mathematics has enough recent evidence to generate a targeted fractions intervention pack.",
    workflow: [
      { title: "Review evidence", description: "Check scores, attendance, and lesson notes.", icon: "analytics", tone: "primary" },
      { title: "Prepare support", description: "Assign differentiated practice and resources.", icon: "auto_stories", tone: "ai" },
      { title: "Track follow-up", description: "Mark support actions complete after the next lesson.", icon: "task_alt", tone: "approved" },
    ],
  },
  "lesson-planner": {
    title: "Lesson Planner",
    eyebrow: "Planning",
    description:
      "Plan, review, and reuse lessons with curriculum alignment and AI-assisted drafting.",
    actions: [
      { label: "New Lesson Plan", icon: "add", href: "/lesson-planner/new", variant: "primary" },
      { label: "Generate with Pal", icon: "auto_awesome", href: "/ask-pal", variant: "ai" },
    ],
    metrics: [
      { label: "This Week", value: "14", detail: "9 ready to teach", icon: "auto_stories", tone: "primary" },
      { label: "Drafts", value: "5", detail: "Need completion", icon: "description", tone: "draft" },
      { label: "Reviewed", value: "7", detail: "Approved by lead", icon: "verified_user", tone: "approved" },
      { label: "Reusable", value: "23", detail: "In your library", icon: "folder_open", tone: "neutral" },
    ],
    segments: ["Current Week", "Drafts", "Approved", "Reusable"],
    primaryPanel: {
      title: "Lesson Plan Queue",
      description: "Plans ordered by teaching date and readiness.",
      action: { label: "Create", icon: "add", href: "/lesson-planner/new" },
      rows: [
        { title: "Equivalent Fractions", detail: "Primary 4 Mathematics, 40-minute lesson with guided practice.", icon: "auto_stories", tone: "primary", meta: "Tomorrow 9:00 AM", status: "Draft", statusTone: "draft", progress: 72 },
        { title: "Reading for Meaning", detail: "Primary 3 English comprehension lesson with paired reading.", icon: "description", tone: "review", meta: "Friday", status: "Needs Review", statusTone: "review", progress: 84 },
        { title: "Evaporation Practical", detail: "Primary 5 Basic Science with lab safety checklist.", icon: "school", tone: "approved", meta: "Monday", status: "Approved", statusTone: "approved", progress: 100 },
      ],
    },
    secondaryPanel: {
      title: "Planning Templates",
      rows: [
        { title: "Direct Instruction", detail: "Starter, modeling, guided practice, independent work.", icon: "description", tone: "neutral" },
        { title: "Inquiry Practical", detail: "Question, prediction, experiment, reflection.", icon: "school", tone: "primary" },
        { title: "AI Lesson Draft", detail: "Build a plan from topic, class, duration, and objectives.", icon: "smart_toy", tone: "ai", href: "/ask-pal" },
      ],
    },
    palSuggestion:
      "Your fractions lesson can reuse yesterday's misconceptions and generate a 10-minute starter automatically.",
  },
  assessments: {
    title: "Assessments",
    eyebrow: "Prep Studio",
    description:
      "Create, moderate, approve, and publish classroom assessments with traceable AI assistance.",
    actions: [
      { label: "New Assessment", icon: "assignment_add", href: "/assessments/new", variant: "primary" },
      { label: "Question Bank", icon: "database", href: "/question-bank", variant: "secondary" },
    ],
    metrics: [
      { label: "Drafts", value: "6", detail: "2 due today", icon: "assignment", tone: "draft" },
      { label: "In Review", value: "4", detail: "Awaiting moderation", icon: "verified_user", tone: "review" },
      { label: "Published", value: "12", detail: "This term", icon: "task_alt", tone: "approved" },
      { label: "AI Assisted", value: "9", detail: "Teacher reviewed", icon: "auto_awesome", tone: "ai" },
    ],
    segments: ["All", "Draft", "In Review", "Published", "AI Assisted"],
    primaryPanel: {
      title: "Assessment Pipeline",
      description: "Live assessment work across your assigned classes.",
      action: { label: "Create", icon: "add", href: "/assessments/new" },
      rows: [
        { title: "Primary 4 Mathematics CA", detail: "Fractions, factors, and place value; 25 marks.", icon: "quiz", tone: "review", meta: "Due today 4:00 PM", status: "Incomplete", statusTone: "changes", progress: 55 },
        { title: "Primary 3 English Summary Test", detail: "Reading comprehension and vocabulary.", icon: "description", tone: "draft", meta: "Due tomorrow", status: "Draft", statusTone: "draft", progress: 64 },
        { title: "Science Practical Rubric", detail: "Observation checklist and marking guide.", icon: "grading", tone: "approved", meta: "Published", status: "Approved", statusTone: "approved", progress: 100 },
      ],
    },
    secondaryPanel: {
      title: "Moderation Tasks",
      rows: [
        { title: "Check mark allocation", detail: "Two questions exceed expected difficulty.", icon: "priority_high", tone: "review" },
        { title: "Attach answer key", detail: "Required before publishing Math CA.", icon: "grading", tone: "changes" },
        { title: "Generate variants", detail: "Create practice set from approved questions.", icon: "smart_toy", tone: "ai", href: "/ask-pal" },
      ],
    },
    palSuggestion:
      "The Math CA draft can be completed from the current question bank and the term's pacing guide.",
  },
  "question-bank": {
    title: "Question Bank",
    eyebrow: "Assessment Assets",
    description:
      "Search, tag, moderate, and reuse questions across subjects while preserving review history.",
    actions: [
      { label: "Add Question", icon: "add", variant: "primary" },
      { label: "Generate Questions", icon: "auto_awesome", href: "/ask-pal", variant: "ai" },
    ],
    metrics: [
      { label: "Questions", value: "418", detail: "Across 8 subjects", icon: "database", tone: "primary" },
      { label: "Reviewed", value: "76%", detail: "Quality checked", icon: "verified_user", tone: "approved" },
      { label: "Needs Edit", value: "18", detail: "Flagged items", icon: "priority_high", tone: "review" },
      { label: "AI Drafts", value: "42", detail: "Awaiting teacher review", icon: "auto_awesome", tone: "ai" },
    ],
    segments: ["All", "Mathematics", "English", "Science", "Needs Review"],
    primaryPanel: {
      title: "Recent Questions",
      description: "Newest and most-used items in your bank.",
      rows: [
        { title: "Identify equivalent fractions", detail: "Multiple choice, Primary 4, medium difficulty.", icon: "quiz", tone: "primary", meta: "Used 3 times", status: "Approved", statusTone: "approved" },
        { title: "Main idea in a short passage", detail: "Comprehension item with rubric guidance.", icon: "description", tone: "review", meta: "Edited today", status: "In Review", statusTone: "review" },
        { title: "Water cycle sequencing", detail: "Drag-order practical reasoning prompt.", icon: "school", tone: "ai", meta: "AI generated", status: "AI Draft", statusTone: "ai" },
      ],
    },
    secondaryPanel: {
      title: "Quality Checks",
      rows: [
        { title: "Difficulty balance", detail: "Math CA needs one additional low-stakes item.", icon: "analytics", tone: "primary" },
        { title: "Duplicate detector", detail: "Two English questions are near duplicates.", icon: "priority_high", tone: "review" },
        { title: "Curriculum tags", detail: "12 items missing curriculum strand tags.", icon: "topic", tone: "draft" },
      ],
    },
  },
  timetable: {
    title: "Timetable",
    eyebrow: "Schedule",
    description:
      "View daily teaching blocks, room assignments, conflicts, and protected school events.",
    actions: [
      { label: "Today", icon: "calendar_today", variant: "primary" },
      { label: "Optimize Week", icon: "auto_awesome", href: "/ask-pal", variant: "ai" },
    ],
    metrics: [
      { label: "Today", value: "7", detail: "Teaching blocks", icon: "schedule", tone: "primary" },
      { label: "Free Periods", value: "2", detail: "Planning windows", icon: "calendar_view_day", tone: "neutral" },
      { label: "Conflicts", value: "0", detail: "All clear", icon: "task_alt", tone: "approved" },
      { label: "Coverage", value: "94%", detail: "Weekly plan fit", icon: "analytics", tone: "primary" },
    ],
    segments: ["Today", "Week", "Rooms", "Conflicts"],
    primaryPanel: {
      title: "Thursday Schedule",
      rows: [
        { title: "Staff Briefing", detail: "Leadership notices and day plan.", icon: "groups", tone: "neutral", meta: "8:00 - 8:40 AM", status: "Done", statusTone: "approved" },
        { title: "Primary 4 Mathematics", detail: "Equivalent Fractions in Room 4B.", icon: "calculate", tone: "primary", meta: "9:20 - 10:00 AM", status: "Current", statusTone: "primary" },
        { title: "Primary 3 English", detail: "Reading comprehension and vocabulary.", icon: "description", tone: "neutral", meta: "11:00 - 11:40 AM", status: "Upcoming", statusTone: "draft" },
      ],
    },
    secondaryPanel: {
      title: "Schedule Health",
      rows: [
        { title: "No room clashes", detail: "All assigned rooms are available.", icon: "task_alt", tone: "approved" },
        { title: "Planning window", detail: "12:20 PM slot reserved for lesson wrap-up.", icon: "schedule", tone: "primary" },
        { title: "Calendar sync", detail: "Term event sync completed 1 hour ago.", icon: "calendar_month", tone: "neutral" },
      ],
    },
  },
  "academic-calendar": {
    title: "Academic Calendar",
    eyebrow: "Term Planning",
    description:
      "Track school events, reporting deadlines, assessment windows, and lesson pacing milestones.",
    actions: [
      { label: "Add Event", icon: "add", variant: "primary" },
      { label: "Plan Around Events", icon: "smart_toy", href: "/ask-pal", variant: "ai" },
    ],
    metrics: [
      { label: "Term Weeks", value: "11", detail: "Week 6 active", icon: "calendar_month", tone: "primary" },
      { label: "Upcoming", value: "8", detail: "Next 14 days", icon: "schedule", tone: "neutral" },
      { label: "Assessment Window", value: "5d", detail: "Starts Monday", icon: "assignment", tone: "review" },
      { label: "Reports Due", value: "18 Nov", detail: "Draft deadline", icon: "analytics", tone: "primary" },
    ],
    segments: ["Term View", "Assessments", "Reports", "Events"],
    primaryPanel: {
      title: "Upcoming Milestones",
      rows: [
        { title: "Second CA Window Opens", detail: "All CA drafts should be reviewed before Monday.", icon: "assignment", tone: "review", meta: "Nov 3", status: "Prepare", statusTone: "review" },
        { title: "Parent Consultation Day", detail: "Performance summaries required for focus learners.", icon: "groups", tone: "primary", meta: "Nov 7" },
        { title: "Report Draft Deadline", detail: "Class report comments and scores due by 4:00 PM.", icon: "analytics", tone: "changes", meta: "Nov 18", status: "Due Soon", statusTone: "changes" },
      ],
    },
    secondaryPanel: {
      title: "Calendar Actions",
      rows: [
        { title: "Protect revision week", detail: "Reserve final week for remediation.", icon: "calendar_month", tone: "primary" },
        { title: "Notify guardians", detail: "Send consultation reminders.", icon: "link", tone: "neutral" },
        { title: "Generate pacing plan", detail: "Use Pal to rebalance remaining objectives.", icon: "smart_toy", tone: "ai", href: "/ask-pal" },
      ],
    },
  },
  gradebook: {
    title: "Gradebook",
    eyebrow: "Scores",
    description:
      "Enter scores, review learner trends, calculate grades, and surface missing marks before reports.",
    actions: [
      { label: "Enter Scores", icon: "grading", variant: "primary" },
      { label: "Analyze Gaps", icon: "analytics", href: "/reports", variant: "secondary" },
    ],
    metrics: [
      { label: "Completion", value: "87%", detail: "Across active sheets", icon: "task_alt", tone: "approved" },
      { label: "Missing Scores", value: "14", detail: "Mostly English", icon: "priority_high", tone: "review" },
      { label: "Class Average", value: "72%", detail: "Primary 4 Math", icon: "analytics", tone: "primary" },
      { label: "At Risk", value: "6", detail: "Need intervention", icon: "error", tone: "error" },
    ],
    segments: ["Primary 4 Math", "Primary 3 English", "Missing", "Published"],
    primaryPanel: {
      title: "Result Sheets",
      rows: [
        { title: "Primary 4 Mathematics", detail: "CA1, CA2, project, and exam columns configured.", icon: "grading", tone: "primary", meta: "24 learners", status: "87% Complete", statusTone: "primary", progress: 87 },
        { title: "Primary 3 English", detail: "Summary writing scores still pending.", icon: "description", tone: "review", meta: "28 learners", status: "Missing Scores", statusTone: "review", progress: 63 },
        { title: "Primary 5 Basic Science", detail: "All practical and theory marks entered.", icon: "school", tone: "approved", meta: "31 learners", status: "Ready", statusTone: "approved", progress: 100 },
      ],
    },
    secondaryPanel: {
      title: "Learner Flags",
      rows: [
        { title: "Daniel Bello", detail: "Dropped 12 points in fractions strand.", icon: "person_check", tone: "error", meta: "Needs support" },
        { title: "Aisha Musa", detail: "Strong improvement after revision set.", icon: "task_alt", tone: "approved", meta: "+18%" },
        { title: "Class trend", detail: "Improper fractions is the lowest objective.", icon: "analytics", tone: "primary" },
      ],
    },
    palSuggestion:
      "Generate individualized feedback for the six learners below 50% before report drafting.",
  },
  attendance: {
    title: "Attendance",
    eyebrow: "Daily Register",
    description:
      "Mark attendance, review absence trends, and follow up quickly with guardians when patterns emerge.",
    actions: [
      { label: "Mark Today", icon: "how_to_reg", variant: "primary" },
      { label: "Attendance Report", icon: "analytics", href: "/reports", variant: "secondary" },
    ],
    metrics: [
      { label: "Present Today", value: "118", detail: "94% attendance", icon: "how_to_reg", tone: "approved" },
      { label: "Absent", value: "8", detail: "3 recurring", icon: "priority_high", tone: "review" },
      { label: "Late", value: "5", detail: "Arrival after briefing", icon: "schedule", tone: "draft" },
      { label: "Follow-ups", value: "3", detail: "Guardian calls due", icon: "link", tone: "primary" },
    ],
    segments: ["Today", "Absent", "Late", "Follow-up"],
    primaryPanel: {
      title: "Class Registers",
      rows: [
        { title: "Primary 4 Mathematics", detail: "22 present, 2 absent; one learner absent twice this week.", icon: "groups", tone: "primary", meta: "9:20 AM", status: "Marked", statusTone: "approved" },
        { title: "Primary 3 English", detail: "Register pending for 11:00 AM period.", icon: "description", tone: "review", meta: "11:00 AM", status: "Pending", statusTone: "review" },
        { title: "Primary 5 Science", detail: "All learners present for practical session.", icon: "school", tone: "approved", meta: "Monday", status: "Complete", statusTone: "approved" },
      ],
    },
    secondaryPanel: {
      title: "Follow-up List",
      rows: [
        { title: "Daniel Bello", detail: "Absent 2 of the last 5 school days.", icon: "person_check", tone: "review" },
        { title: "Mariam Yusuf", detail: "Late arrival pattern on Wednesdays.", icon: "schedule", tone: "draft" },
        { title: "Guardian log", detail: "Three contact notes need completion.", icon: "description", tone: "neutral" },
      ],
    },
  },
  resources: {
    title: "Resource Library",
    eyebrow: "Teaching Materials",
    description:
      "Organize lesson slides, worksheets, rubrics, previews, and shared teaching resources.",
    actions: [
      { label: "Upload Resource", icon: "add", variant: "primary" },
      { label: "Generate Worksheet", icon: "auto_awesome", href: "/ask-pal", variant: "ai" },
    ],
    metrics: [
      { label: "Resources", value: "146", detail: "Owned and shared", icon: "folder_open", tone: "primary" },
      { label: "Recently Used", value: "18", detail: "Last 7 days", icon: "history", tone: "neutral" },
      { label: "Shared", value: "32", detail: "With your team", icon: "link", tone: "approved" },
      { label: "AI Created", value: "21", detail: "Teacher reviewed", icon: "auto_awesome", tone: "ai" },
    ],
    segments: ["All", "Slides", "Worksheets", "Rubrics", "Shared"],
    primaryPanel: {
      title: "Recent Resources",
      rows: [
        { title: "Fractions Revision Worksheet", detail: "Differentiated practice for Primary 4.", icon: "description", tone: "ai", meta: "Edited 2h ago", status: "AI Assisted", statusTone: "ai" },
        { title: "Science Practical Safety Guide", detail: "Lab safety checklist and observation sheet.", icon: "school", tone: "approved", meta: "Shared", status: "Published", statusTone: "approved" },
        { title: "Comprehension Passage Pack", detail: "Three short texts with question prompts.", icon: "folder_open", tone: "primary", meta: "Uploaded yesterday" },
      ],
    },
    secondaryPanel: {
      title: "Library Hygiene",
      rows: [
        { title: "Tag missing files", detail: "12 resources need subject tags.", icon: "topic", tone: "draft" },
        { title: "Archive old drafts", detail: "9 unused draft worksheets from last term.", icon: "folder_open", tone: "neutral" },
        { title: "Share Math pack", detail: "Recommended for Primary 4 team.", icon: "link", tone: "primary" },
      ],
    },
  },
  approvals: {
    title: "Approvals",
    eyebrow: "Review Workflow",
    description:
      "Track assessment reviews, lesson approvals, reviewer assignments, and requested changes.",
    actions: [
      { label: "Review Queue", icon: "verified_user", variant: "primary" },
      { label: "Delegate", icon: "groups", variant: "secondary" },
    ],
    metrics: [
      { label: "Pending", value: "9", detail: "Across assessments", icon: "verified_user", tone: "review" },
      { label: "Approved", value: "18", detail: "This term", icon: "task_alt", tone: "approved" },
      { label: "Changes", value: "3", detail: "Returned to owner", icon: "priority_high", tone: "changes" },
      { label: "Avg Time", value: "1.4d", detail: "Review cycle", icon: "schedule", tone: "primary" },
    ],
    segments: ["Pending", "My Reviews", "Changes Requested", "Approved"],
    primaryPanel: {
      title: "Approval Queue",
      rows: [
        { title: "Primary 4 Mathematics CA", detail: "Needs answer key and difficulty balance check.", icon: "assignment", tone: "review", meta: "Due today", owner: "Mrs. Adeyemi", status: "In Review", statusTone: "review" },
        { title: "Science Practical Rubric", detail: "Ready for final approval after department review.", icon: "grading", tone: "approved", meta: "Submitted yesterday", owner: "Mr. Okoro", status: "Approved", statusTone: "approved" },
        { title: "English Summary Test", detail: "Returned with readability changes requested.", icon: "description", tone: "changes", meta: "2 comments", owner: "Mrs. Adeyemi", status: "Changes", statusTone: "changes" },
      ],
    },
    secondaryPanel: {
      title: "Reviewer Activity",
      rows: [
        { title: "Mrs. Bello", detail: "Reviewed 4 assessments this week.", icon: "person_check", tone: "approved" },
        { title: "Pending delegation", detail: "Two requests have no reviewer assigned.", icon: "groups", tone: "review" },
        { title: "Audit trail", detail: "All AI-generated items have confirmation logs.", icon: "smart_toy", tone: "ai" },
      ],
    },
  },
  reports: {
    title: "Reports",
    eyebrow: "Analytics & Publishing",
    description:
      "Review class performance, learner profiles, report-card readiness, and publication status.",
    actions: [
      { label: "Generate Report", icon: "analytics", variant: "primary" },
      { label: "Draft Comments", icon: "auto_awesome", href: "/ask-pal", variant: "ai" },
    ],
    metrics: [
      { label: "Report Readiness", value: "71%", detail: "Primary classes", icon: "analytics", tone: "primary" },
      { label: "Comments Drafted", value: "48", detail: "Teacher reviewed", icon: "description", tone: "ai" },
      { label: "Missing Data", value: "14", detail: "Scores and attendance", icon: "priority_high", tone: "review" },
      { label: "Published", value: "0", detail: "Publication locked", icon: "verified_user", tone: "draft" },
    ],
    segments: ["Readiness", "Learner Profiles", "Report Cards", "Publishing"],
    primaryPanel: {
      title: "Report Workbench",
      rows: [
        { title: "Primary 4 Mathematics Result Sheet", detail: "Missing 4 CA scores and 2 conduct comments.", icon: "grading", tone: "review", meta: "71% ready", status: "Action Needed", statusTone: "review", progress: 71 },
        { title: "Daniel Bello Performance Profile", detail: "Needs intervention summary for fractions strand.", icon: "person_check", tone: "error", meta: "Focus learner", status: "At Risk", statusTone: "error" },
        { title: "Class Result Summary", detail: "Average, distribution, and strand analysis generated.", icon: "analytics", tone: "approved", meta: "Draft ready", status: "Ready", statusTone: "approved" },
      ],
    },
    secondaryPanel: {
      title: "Publishing Checklist",
      rows: [
        { title: "Complete missing scores", detail: "Required before report review.", icon: "grading", tone: "review" },
        { title: "Review AI comments", detail: "48 generated comments need human confirmation.", icon: "smart_toy", tone: "ai" },
        { title: "Lock template", detail: "School branding template is ready.", icon: "task_alt", tone: "approved" },
      ],
    },
    palSuggestion:
      "Ask Pal can draft neutral, evidence-based comments for learners with complete score profiles.",
  },
  "my-tasks": {
    title: "My Tasks",
    eyebrow: "Work Queue",
    description:
      "A focused queue of teaching, grading, planning, and approval tasks due across your workspace.",
    actions: [
      { label: "Add Task", icon: "add", variant: "primary" },
      { label: "Prioritize with Pal", icon: "smart_toy", href: "/ask-pal", variant: "ai" },
    ],
    metrics: [
      { label: "Open", value: "17", detail: "Across all modules", icon: "task_alt", tone: "primary" },
      { label: "Due Today", value: "5", detail: "Two high priority", icon: "priority_high", tone: "review" },
      { label: "Blocked", value: "2", detail: "Waiting on review", icon: "error", tone: "changes" },
      { label: "Completed", value: "31", detail: "This week", icon: "task_alt", tone: "approved" },
    ],
    segments: ["Today", "This Week", "Blocked", "Completed"],
    primaryPanel: {
      title: "Priority Tasks",
      rows: [
        { title: "Finish Primary 4 Mathematics CA", detail: "Attach answer key and complete final 10 marks.", icon: "assignment", tone: "review", meta: "Due today 4:00 PM", status: "High", statusTone: "changes" },
        { title: "Enter English summary scores", detail: "28 learner rows pending in gradebook.", icon: "grading", tone: "review", meta: "Due tomorrow" },
        { title: "Call Daniel Bello's guardian", detail: "Attendance follow-up and learning support discussion.", icon: "link", tone: "primary", meta: "Today" },
      ],
    },
    secondaryPanel: {
      title: "Completed Recently",
      rows: [
        { title: "Marked attendance", detail: "Primary 4 Mathematics register completed.", icon: "how_to_reg", tone: "approved" },
        { title: "Shared resource pack", detail: "Fractions worksheet sent to Primary 4 team.", icon: "folder_open", tone: "approved" },
        { title: "Reviewed Science rubric", detail: "Approval comments submitted.", icon: "verified_user", tone: "approved" },
      ],
    },
  },
  help: {
    title: "Help Centre",
    eyebrow: "Support",
    description:
      "Find guides, contact support, review product walkthroughs, and learn the fastest way to complete workflows.",
    actions: [
      { label: "New Support Request", icon: "help", variant: "primary" },
      { label: "Ask Pal", icon: "smart_toy", href: "/ask-pal", variant: "ai" },
    ],
    metrics: [
      { label: "Guides", value: "42", detail: "Teacher workflows", icon: "description", tone: "primary" },
      { label: "Tickets", value: "2", detail: "Open support requests", icon: "help", tone: "review" },
      { label: "Resolved", value: "14", detail: "This term", icon: "task_alt", tone: "approved" },
      { label: "Learning", value: "68%", detail: "Onboarding complete", icon: "school", tone: "primary" },
    ],
    segments: ["Recommended", "Guides", "Tickets", "AI Help"],
    primaryPanel: {
      title: "Recommended Guides",
      rows: [
        { title: "Create an assessment", detail: "Build, review, and publish a class assessment.", icon: "assignment", tone: "primary", meta: "5 min read" },
        { title: "Use Ask Pal safely", detail: "Review generated actions before applying changes.", icon: "smart_toy", tone: "ai", meta: "3 min read", href: "/ask-pal" },
        { title: "Publish report cards", detail: "Prepare scores, comments, and approval workflow.", icon: "analytics", tone: "neutral", meta: "7 min read" },
      ],
    },
    secondaryPanel: {
      title: "Support Requests",
      rows: [
        { title: "Gradebook import question", detail: "Waiting for support response.", icon: "help", tone: "review", status: "Open", statusTone: "review" },
        { title: "Template branding", detail: "Resolved by school admin.", icon: "task_alt", tone: "approved", status: "Closed", statusTone: "approved" },
      ],
    },
  },
  settings: {
    title: "Settings",
    eyebrow: "Account & Preferences",
    description:
      "Manage profile details, notifications, security, accessibility, and AI usage preferences.",
    actions: [
      { label: "Save Changes", icon: "task_alt", variant: "primary" },
      { label: "AI Settings", icon: "smart_toy", href: "/ask-pal", variant: "ai" },
    ],
    metrics: [
      { label: "Profile", value: "92%", detail: "Almost complete", icon: "person_check", tone: "primary" },
      { label: "Security", value: "Good", detail: "2 active sessions", icon: "verified_user", tone: "approved" },
      { label: "Notifications", value: "8", detail: "Enabled channels", icon: "notifications", tone: "neutral" },
      { label: "AI Usage", value: "82%", detail: "Monthly limit", icon: "smart_toy", tone: "ai" },
    ],
    segments: ["Profile", "Notifications", "Security", "Accessibility", "AI"],
    primaryPanel: {
      title: "Preference Groups",
      rows: [
        { title: "Profile and account", detail: "Name, role, school workspace, and avatar initials.", icon: "person_check", tone: "primary", status: "Complete", statusTone: "approved" },
        { title: "Notifications", detail: "Approval alerts, due dates, support updates, and weekly digests.", icon: "notifications", tone: "neutral", status: "8 Enabled", statusTone: "primary" },
        { title: "AI permissions", detail: "Confirmation rules, source access, and monthly usage visibility.", icon: "smart_toy", tone: "ai", status: "Review", statusTone: "review" },
      ],
    },
    secondaryPanel: {
      title: "Security",
      rows: [
        { title: "Active session", detail: "Current device signed in today.", icon: "verified_user", tone: "approved" },
        { title: "Password", detail: "Last changed 42 days ago.", icon: "settings", tone: "neutral" },
        { title: "Audit history", detail: "AI actions and approvals are logged.", icon: "description", tone: "primary" },
      ],
    },
  },
};

export const builderPages: Record<string, BuilderPageConfig> = {
  "lesson-planner": {
    title: "New Lesson Plan",
    eyebrow: "Lesson Planner",
    description:
      "Draft a curriculum-aligned lesson plan with objectives, activities, checks for understanding, and resources.",
    backHref: "/lesson-planner",
    fields: [
      { label: "Class", value: "Primary 4" },
      { label: "Subject", value: "Mathematics" },
      { label: "Topic", value: "Equivalent Fractions" },
      { label: "Duration", value: "40 minutes" },
      {
        label: "Learning Objectives",
        value: "Learners will identify, compare, and generate equivalent fractions using visual models.",
        kind: "textarea",
      },
      {
        label: "Success Criteria",
        value: "Learners can explain why two fractions are equivalent and solve five practice items independently.",
        kind: "textarea",
      },
    ],
    outlineTitle: "Lesson Flow",
    outline: [
      { title: "Starter", detail: "Use fraction strips to revisit halves, thirds, and quarters." },
      { title: "Teach and Model", detail: "Show how multiplying numerator and denominator creates equivalence." },
      { title: "Guided Practice", detail: "Pairs solve visual and numerical examples with teacher prompts." },
      { title: "Exit Ticket", detail: "Five short questions to identify learners needing support." },
    ],
    checklist: [
      "Curriculum strand selected",
      "Differentiation included",
      "Assessment evidence planned",
      "Resources attached",
    ],
    palReview:
      "This plan is strong for a 40-minute lesson. Add one misconception check before independent practice.",
  },
  assessments: {
    title: "New Assessment",
    eyebrow: "Prep Studio",
    description:
      "Build an assessment draft with sections, mark allocation, moderation notes, and publishing readiness.",
    backHref: "/assessments",
    fields: [
      { label: "Class", value: "Primary 4" },
      { label: "Subject", value: "Mathematics" },
      { label: "Assessment Type", value: "Second Continuous Assessment" },
      { label: "Total Marks", value: "25" },
      {
        label: "Covered Objectives",
        value: "Equivalent fractions, place value, multiplication facts, and word problems.",
        kind: "textarea",
      },
      {
        label: "Moderation Notes",
        value: "Ensure low, medium, and high difficulty items are balanced and the answer key is complete.",
        kind: "textarea",
      },
    ],
    outlineTitle: "Assessment Structure",
    outline: [
      { title: "Section A: Multiple Choice", detail: "10 questions, 1 mark each, covering core recall and recognition." },
      { title: "Section B: Short Answers", detail: "5 questions, 2 marks each, requiring worked steps." },
      { title: "Section C: Word Problem", detail: "1 extended item, 5 marks, with rubric guidance." },
    ],
    checklist: [
      "Question count matches mark scheme",
      "Answer key required",
      "Difficulty spread reviewed",
      "AI-generated items flagged for review",
    ],
    palReview:
      "The assessment is aligned to recent lesson evidence. Add one low-stakes equivalent-fraction visual item.",
  },
};

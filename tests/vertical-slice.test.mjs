import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import test from "node:test";
import { setTimeout as delay } from "node:timers/promises";

const host = "127.0.0.1";
const port = 3210;
const baseUrl = `http://${host}:${port}`;
let server;
let serverOutput = "";

test.before(async () => {
  server = spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "dev", "-p", String(port), "-H", host],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        NEXT_TELEMETRY_DISABLED: "1",
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  server.stdout.on("data", (chunk) => {
    serverOutput += chunk.toString();
  });
  server.stderr.on("data", (chunk) => {
    serverOutput += chunk.toString();
  });

  await waitForServer();
});

test.after(async () => {
  if (!server || server.killed) {
    return;
  }

  server.kill("SIGTERM");
  await delay(500);

  if (!server.killed) {
    server.kill("SIGKILL");
  }
});

test("teacher dashboard slice summarizes active workspace scope", async () => {
  const unauthenticated = await fetch(`${baseUrl}/api/v1/teacher/dashboard`);
  assert.equal(unauthenticated.status, 401);

  const teacherCookie = await login("mrs.adeyemi@truth.test", "password");
  const dashboard = await getJson("/api/v1/teacher/dashboard", teacherCookie);

  assert.equal(dashboard.user.email, "mrs.adeyemi@truth.test");
  assert.equal(dashboard.workspace.id, "school-truth");
  assert.equal(dashboard.permissions.canUseAi, true);

  const classIds = dashboard.classProgress.map((classItem) => classItem.id);
  assert.ok(classIds.includes("class-p4-math"));
  assert.ok(classIds.includes("class-p3-english"));
  assert.ok(!classIds.includes("class-p5-science"));

  const scheduleIds = dashboard.schedule.map((event) => event.id);
  assert.ok(scheduleIds.includes("timetable-p4-fractions"));
  assert.ok(scheduleIds.includes("timetable-p3-reading"));
  assert.ok(!scheduleIds.includes("timetable-p5-practical"));
  assert.ok(!scheduleIds.includes("timetable-river-community"));

  const urgentTaskIds = dashboard.urgentTasks.map((task) => task.id);
  assert.ok(urgentTaskIds.includes("task-p3-score-entry"));
  assert.ok(!urgentTaskIds.includes("task-p5-lab-check"));

  const dashboardPage = await fetch(`${baseUrl}/`, {
    headers: { cookie: teacherCookie },
  });
  assert.equal(dashboardPage.status, 200);
  const dashboardHtml = await dashboardPage.text();
  assert.match(dashboardHtml, /Good morning/);
  assert.match(dashboardHtml, /Mrs\. Adeyemi/);
  assert.match(dashboardHtml, /Schedule/);
  assert.match(dashboardHtml, /Primary 4 Mathematics/);
});

test("admin dashboard can summarize managed workspace classes", async () => {
  const adminCookie = await login("admin@truth.test", "password");
  const dashboard = await getJson("/api/v1/teacher/dashboard", adminCookie);
  const classIds = dashboard.classProgress.map((classItem) => classItem.id);
  const scheduleIds = dashboard.schedule.map((event) => event.id);

  assert.ok(classIds.includes("class-p5-science"));
  assert.ok(scheduleIds.includes("timetable-p5-practical"));
});

test("ask pal slice scopes assistant context and proposals", async () => {
  const unauthenticated = await fetch(`${baseUrl}/api/v1/ai/conversations`);
  assert.equal(unauthenticated.status, 401);

  const riverCookie = await login("river.teacher@truth.test", "password");
  const forbiddenAi = await fetchJson("/api/v1/ai/conversations", riverCookie);
  assert.equal(forbiddenAi.response.status, 403);

  const teacherCookie = await login("mrs.adeyemi@truth.test", "password");
  const assistant = await getJson("/api/v1/ai/conversations", teacherCookie);

  assert.equal(assistant.user.email, "mrs.adeyemi@truth.test");
  assert.equal(assistant.workspace.id, "school-truth");
  assert.equal(assistant.permissions.canUseAi, true);
  assert.ok(assistant.activeTags.includes("Primary 4"));
  assert.ok(assistant.activeTags.includes("Mathematics"));
  assert.ok(assistant.sources.some((source) => source.href === "/timetable/timetable-p4-fractions"));
  assert.ok(!assistant.sources.some((source) => source.title.includes("Primary 5")));

  const invalidProposal = await postJson("/api/v1/ai/proposals", teacherCookie, {
    prompt: "",
  });
  assert.equal(invalidProposal.response.status, 400);

  const proposal = await postJson("/api/v1/ai/proposals", teacherCookie, {
    prompt: "Prepare my next lesson with support steps.",
    quickActionId: "prepare-next-lesson",
    sourceIds: assistant.sources.slice(0, 2).map((source) => source.id),
  });
  assert.equal(proposal.response.status, 201);
  assert.equal(proposal.body.data.requiresConfirmation, true);
  assert.equal(proposal.body.data.suggestedActions[0].href, "/lesson-planner/new");
  assert.match(proposal.body.data.assistantMessage.body, /Primary 4 Mathematics/);

  const askPalPage = await fetch(`${baseUrl}/ask-pal`, {
    headers: { cookie: teacherCookie },
  });
  assert.equal(askPalPage.status, 200);
  const askPalHtml = await askPalPage.text();
  assert.match(askPalHtml, /What are we preparing today/);
  assert.match(askPalHtml, /Primary 4 Mathematics/);

  const forbiddenPage = await fetch(`${baseUrl}/ask-pal`, {
    headers: { cookie: riverCookie },
  });
  assert.equal(forbiddenPage.status, 200);
  assert.match(await forbiddenPage.text(), /Permission required/);
});

test("teacher classes vertical slice enforces auth, permissions, and tenant scope", async () => {
  const unauthenticated = await fetch(`${baseUrl}/api/v1/teacher/classes`);
  assert.equal(unauthenticated.status, 401);

  const teacherCookie = await login("mrs.adeyemi@truth.test", "password");
  const me = await getJson("/api/v1/me", teacherCookie);
  assert.equal(me.user.email, "mrs.adeyemi@truth.test");
  assert.equal(me.activeWorkspace.id, "school-truth");

  const classes = await getJson("/api/v1/teacher/classes", teacherCookie);
  const classIds = classes.classes.map((classItem) => classItem.id);
  assert.deepEqual(classIds, ["class-p3-english", "class-p4-math"]);

  const assignedClass = await fetchJson("/api/v1/classes/class-p4-math", teacherCookie);
  assert.equal(assignedClass.response.status, 200);
  assert.equal(assignedClass.body.data.id, "class-p4-math");

  const unassignedClass = await fetchJson("/api/v1/classes/class-p5-science", teacherCookie);
  assert.equal(unassignedClass.response.status, 403);

  const crossTenantClass = await fetchJson("/api/v1/classes/class-river-history", teacherCookie);
  assert.equal(crossTenantClass.response.status, 404);

  const classesPage = await fetch(`${baseUrl}/classes`, {
    headers: { cookie: teacherCookie },
  });
  assert.equal(classesPage.status, 200);
  assert.match(await classesPage.text(), /Primary 4 Mathematics/);

  const overviewPage = await fetch(`${baseUrl}/classes/class-p4-math`, {
    headers: { cookie: teacherCookie },
  });
  assert.equal(overviewPage.status, 200);
  assert.match(await overviewPage.text(), /Equivalent Fractions/);
});

test("admin membership can view all classes in the active workspace", async () => {
  const adminCookie = await login("admin@truth.test", "password");
  const classes = await getJson("/api/v1/teacher/classes", adminCookie);
  const classIds = classes.classes.map((classItem) => classItem.id);

  assert.deepEqual(classIds, ["class-p3-english", "class-p4-math", "class-p5-science"]);

  const scienceClass = await fetchJson("/api/v1/classes/class-p5-science", adminCookie);
  assert.equal(scienceClass.response.status, 200);
  assert.equal(scienceClass.body.data.id, "class-p5-science");
});

test("attendance slice records registers with the same tenant and assignment rules", async () => {
  const teacherCookie = await login("mrs.adeyemi@truth.test", "password");

  const unauthenticated = await fetch(`${baseUrl}/api/v1/teacher/attendance`);
  assert.equal(unauthenticated.status, 401);

  const attendance = await getJson("/api/v1/teacher/attendance", teacherCookie);
  assert.deepEqual(
    attendance.classes.map((classItem) => classItem.id),
    ["class-p3-english", "class-p4-math"],
  );

  const register = await getJson(
    "/api/v1/classes/class-p3-english/attendance",
    teacherCookie,
  );
  assert.equal(register.status, "partial");
  assert.equal(register.counts.pending, 1);

  const updated = await postJson(
    "/api/v1/classes/class-p3-english/attendance",
    teacherCookie,
    {
      records: [
        { learnerId: "learner-ife", status: "present" },
        {
          learnerId: "learner-zara",
          status: "absent",
          note: "Guardian follow-up needed",
        },
      ],
    },
  );
  assert.equal(updated.response.status, 200);
  assert.equal(updated.body.data.status, "complete");
  assert.equal(updated.body.data.counts.absent, 1);
  assert.equal(
    updated.body.data.learners.find((learner) => learner.learnerId === "learner-zara").note,
    "Guardian follow-up needed",
  );

  const invalidLearner = await postJson(
    "/api/v1/classes/class-p3-english/attendance",
    teacherCookie,
    {
      records: [{ learnerId: "learner-uche", status: "present" }],
    },
  );
  assert.equal(invalidLearner.response.status, 400);

  const unassignedClass = await fetchJson(
    "/api/v1/classes/class-p5-science/attendance",
    teacherCookie,
  );
  assert.equal(unassignedClass.response.status, 403);

  const crossTenantClass = await fetchJson(
    "/api/v1/classes/class-river-history/attendance",
    teacherCookie,
  );
  assert.equal(crossTenantClass.response.status, 404);

  const attendancePage = await fetch(`${baseUrl}/attendance`, {
    headers: { cookie: teacherCookie },
  });
  assert.equal(attendancePage.status, 200);
  assert.match(await attendancePage.text(), /Primary 3 English/);

  const registerPage = await fetch(`${baseUrl}/attendance/class-p3-english`, {
    headers: { cookie: teacherCookie },
  });
  assert.equal(registerPage.status, 200);
  assert.match(await registerPage.text(), /Save register/);
});

test("admin membership can record attendance for all classes in the active workspace", async () => {
  const adminCookie = await login("admin@truth.test", "password");
  const scienceRegister = await getJson(
    "/api/v1/classes/class-p5-science/attendance",
    adminCookie,
  );

  assert.equal(scienceRegister.id, "class-p5-science");
  assert.equal(scienceRegister.status, "complete");
});

test("lesson planner slice creates and scopes lesson plans", async () => {
  const unauthenticated = await fetch(`${baseUrl}/api/v1/teacher/lesson-plans`);
  assert.equal(unauthenticated.status, 401);

  const teacherCookie = await login("mrs.adeyemi@truth.test", "password");
  const plans = await getJson("/api/v1/teacher/lesson-plans", teacherCookie);
  const planIds = plans.lessonPlans.map((lessonPlan) => lessonPlan.id);
  assert.deepEqual(planIds, ["lesson-p4-fractions", "lesson-p3-reading"]);

  const assignedPlan = await fetchJson(
    "/api/v1/lesson-plans/lesson-p4-fractions",
    teacherCookie,
  );
  assert.equal(assignedPlan.response.status, 200);
  assert.equal(assignedPlan.body.data.title, "Equivalent Fractions");

  const unassignedPlan = await fetchJson(
    "/api/v1/lesson-plans/lesson-p5-evaporation",
    teacherCookie,
  );
  assert.equal(unassignedPlan.response.status, 403);

  const crossTenantPlan = await fetchJson(
    "/api/v1/lesson-plans/lesson-river-community",
    teacherCookie,
  );
  assert.equal(crossTenantPlan.response.status, 404);

  const invalidDraft = await postJson("/api/v1/lesson-plans", teacherCookie, {
    classId: "class-p3-english",
    title: "",
    topic: "Prediction and evidence",
    scheduledFor: "2026-07-22",
    durationMinutes: 40,
    objectives: [],
    materials: ["Reader"],
    starterActivity: "Prompt",
    teachingActivity: "Model",
    learnerPractice: "Practice",
    assessmentCheck: "Exit ticket",
    differentiation: "Support prompts",
  });
  assert.equal(invalidDraft.response.status, 400);

  const unassignedDraft = await postJson("/api/v1/lesson-plans", teacherCookie, {
    classId: "class-p5-science",
    title: "Unassigned Science Draft",
    topic: "Changes of state",
    scheduledFor: "2026-07-22",
    durationMinutes: 40,
    objectives: ["Describe one change of state"],
    materials: ["Tray"],
    starterActivity: "Prediction",
    teachingActivity: "Demonstration",
    learnerPractice: "Observation notes",
    assessmentCheck: "Exit ticket",
    differentiation: "Prompt cards",
  });
  assert.equal(unassignedDraft.response.status, 403);

  const created = await postJson("/api/v1/lesson-plans", teacherCookie, {
    classId: "class-p3-english",
    title: "Prediction and Evidence",
    topic: "Using clues before reading",
    scheduledFor: "2026-07-22",
    durationMinutes: 40,
    objectives: ["Make a prediction from the title", "Support a prediction with one clue"],
    materials: ["Reader", "Prediction chart"],
    starterActivity: "Learners predict from a covered image.",
    teachingActivity: "Model how to find clues in the title and first paragraph.",
    learnerPractice: "Pairs complete prediction charts.",
    assessmentCheck: "Learners explain whether their prediction changed.",
    differentiation: "Provide sentence starters for support learners.",
  });
  assert.equal(created.response.status, 201);
  assert.equal(created.body.data.title, "Prediction and Evidence");

  const createdDetail = await getJson(
    `/api/v1/lesson-plans/${created.body.data.id}`,
    teacherCookie,
  );
  assert.equal(createdDetail.topic, "Using clues before reading");

  const plannerPage = await fetch(`${baseUrl}/lesson-planner`, {
    headers: { cookie: teacherCookie },
  });
  assert.equal(plannerPage.status, 200);
  assert.match(await plannerPage.text(), /Equivalent Fractions/);

  const newPlanPage = await fetch(`${baseUrl}/lesson-planner/new?classId=class-p3-english`, {
    headers: { cookie: teacherCookie },
  });
  assert.equal(newPlanPage.status, 200);
  assert.match(await newPlanPage.text(), /New Lesson Plan/);

  const detailPage = await fetch(`${baseUrl}/lesson-planner/lesson-p4-fractions`, {
    headers: { cookie: teacherCookie },
  });
  assert.equal(detailPage.status, 200);
  assert.match(await detailPage.text(), /Learning Objectives/);
});

test("admin membership can view all lesson plans in the active workspace", async () => {
  const adminCookie = await login("admin@truth.test", "password");
  const plans = await getJson("/api/v1/teacher/lesson-plans", adminCookie);
  const planIds = plans.lessonPlans.map((lessonPlan) => lessonPlan.id);

  assert.ok(planIds.includes("lesson-p5-evaporation"));

  const sciencePlan = await fetchJson(
    "/api/v1/lesson-plans/lesson-p5-evaporation",
    adminCookie,
  );
  assert.equal(sciencePlan.response.status, 200);
  assert.equal(sciencePlan.body.data.title, "Evaporation Practical");
});

test("assessment slice creates and scopes assessment drafts", async () => {
  const unauthenticated = await fetch(`${baseUrl}/api/v1/teacher/assessments`);
  assert.equal(unauthenticated.status, 401);

  const teacherCookie = await login("mrs.adeyemi@truth.test", "password");
  const assessments = await getJson("/api/v1/teacher/assessments", teacherCookie);
  const assessmentIds = assessments.assessments.map((assessment) => assessment.id);
  assert.deepEqual(assessmentIds, ["assessment-p4-fractions", "assessment-p3-comprehension"]);

  const assignedAssessment = await fetchJson(
    "/api/v1/assessments/assessment-p4-fractions",
    teacherCookie,
  );
  assert.equal(assignedAssessment.response.status, 200);
  assert.equal(assignedAssessment.body.data.title, "Fractions Quick Check");

  const unassignedAssessment = await fetchJson(
    "/api/v1/assessments/assessment-p5-matter",
    teacherCookie,
  );
  assert.equal(unassignedAssessment.response.status, 403);

  const crossTenantAssessment = await fetchJson(
    "/api/v1/assessments/assessment-river-community",
    teacherCookie,
  );
  assert.equal(crossTenantAssessment.response.status, 404);

  const invalidDraft = await postJson("/api/v1/assessments", teacherCookie, {
    classId: "class-p4-math",
    title: "",
    type: "quiz",
    scheduledFor: "2026-07-25",
    dueDate: "2026-07-25",
    durationMinutes: 30,
    totalMarks: 20,
    topics: ["Equivalent fractions"],
    instructions: "Complete all items.",
    items: [{ prompt: "Show one equivalent fraction.", marks: 5, skill: "Reasoning" }],
    reviewNotes: "Check mark total.",
  });
  assert.equal(invalidDraft.response.status, 400);

  const unassignedDraft = await postJson("/api/v1/assessments", teacherCookie, {
    classId: "class-p5-science",
    title: "Matter Evidence Draft",
    type: "continuous_assessment",
    scheduledFor: "2026-07-25",
    dueDate: "2026-07-25",
    durationMinutes: 35,
    totalMarks: 20,
    topics: ["Evaporation"],
    instructions: "Record observations.",
    items: [{ prompt: "Explain one observed change.", marks: 20, skill: "Explanation" }],
    reviewNotes: "Outside assigned scope.",
  });
  assert.equal(unassignedDraft.response.status, 403);

  const created = await postJson("/api/v1/assessments", teacherCookie, {
    classId: "class-p3-english",
    title: "Vocabulary Evidence Check",
    type: "classwork",
    scheduledFor: "2026-07-25",
    dueDate: "2026-07-25",
    durationMinutes: 30,
    totalMarks: 20,
    topics: ["Vocabulary", "Short response"],
    instructions: "Read each sentence and choose the strongest word.",
    items: [
      { prompt: "Choose the best word for the sentence.", marks: 8, skill: "Vocabulary" },
      { prompt: "Explain one word choice.", marks: 12, skill: "Explanation" },
    ],
    reviewNotes: "Confirm support vocabulary before review.",
  });
  assert.equal(created.response.status, 201);
  assert.equal(created.body.data.title, "Vocabulary Evidence Check");

  const createdDetail = await getJson(
    `/api/v1/assessments/${created.body.data.id}`,
    teacherCookie,
  );
  assert.equal(createdDetail.totalMarks, 20);
  assert.equal(createdDetail.items.length, 2);

  const assessmentsPage = await fetch(`${baseUrl}/assessments`, {
    headers: { cookie: teacherCookie },
  });
  assert.equal(assessmentsPage.status, 200);
  assert.match(await assessmentsPage.text(), /Fractions Quick Check/);

  const newAssessmentPage = await fetch(`${baseUrl}/assessments/new?classId=class-p3-english`, {
    headers: { cookie: teacherCookie },
  });
  assert.equal(newAssessmentPage.status, 200);
  assert.match(await newAssessmentPage.text(), /New Assessment/);

  const detailPage = await fetch(`${baseUrl}/assessments/assessment-p4-fractions`, {
    headers: { cookie: teacherCookie },
  });
  assert.equal(detailPage.status, 200);
  assert.match(await detailPage.text(), /Assessment Items/);
});

test("admin membership can view all assessments in the active workspace", async () => {
  const adminCookie = await login("admin@truth.test", "password");
  const assessments = await getJson("/api/v1/teacher/assessments", adminCookie);
  const assessmentIds = assessments.assessments.map((assessment) => assessment.id);

  assert.ok(assessmentIds.includes("assessment-p5-matter"));

  const scienceAssessment = await fetchJson(
    "/api/v1/assessments/assessment-p5-matter",
    adminCookie,
  );
  assert.equal(scienceAssessment.response.status, 200);
  assert.equal(scienceAssessment.body.data.title, "Matter and Change Practical Evidence");
});

test("question bank slice creates and scopes reusable questions", async () => {
  const unauthenticated = await fetch(`${baseUrl}/api/v1/teacher/questions`);
  assert.equal(unauthenticated.status, 401);

  const teacherCookie = await login("mrs.adeyemi@truth.test", "password");
  const questions = await getJson("/api/v1/teacher/questions", teacherCookie);
  const questionIds = questions.questions.map((question) => question.id);
  assert.deepEqual(questionIds, ["question-p4-equivalent-fractions", "question-p3-main-idea"]);

  const assignedQuestion = await fetchJson(
    "/api/v1/questions/question-p4-equivalent-fractions",
    teacherCookie,
  );
  assert.equal(assignedQuestion.response.status, 200);
  assert.match(assignedQuestion.body.data.prompt, /equivalent to 1\/2/);

  const unassignedQuestion = await fetchJson(
    "/api/v1/questions/question-p5-evaporation",
    teacherCookie,
  );
  assert.equal(unassignedQuestion.response.status, 403);

  const crossTenantQuestion = await fetchJson(
    "/api/v1/questions/question-river-community",
    teacherCookie,
  );
  assert.equal(crossTenantQuestion.response.status, 404);

  const invalidDraft = await postJson("/api/v1/questions", teacherCookie, {
    classId: "class-p4-math",
    prompt: "",
    type: "multiple_choice",
    difficulty: "medium",
    status: "draft",
    marks: 4,
    topic: "Equivalent fractions",
    skill: "Representation",
    options: ["1/4"],
    answer: "",
    explanation: "Missing answer and options.",
  });
  assert.equal(invalidDraft.response.status, 400);

  const unassignedDraft = await postJson("/api/v1/questions", teacherCookie, {
    classId: "class-p5-science",
    prompt: "Explain why water changes state faster when heat is added.",
    type: "structured_response",
    difficulty: "hard",
    status: "draft",
    marks: 6,
    topic: "Evaporation",
    skill: "Scientific explanation",
    options: [],
    answer: "Heat increases particle energy.",
    explanation: "Outside assigned teaching scope.",
  });
  assert.equal(unassignedDraft.response.status, 403);

  const created = await postJson("/api/v1/questions", teacherCookie, {
    classId: "class-p3-english",
    prompt: "Which sentence best states the main idea of the passage?",
    type: "multiple_choice",
    difficulty: "medium",
    status: "draft",
    marks: 4,
    topic: "Main idea",
    skill: "Comprehension",
    options: [
      "One small detail from the passage.",
      "What the whole passage is mostly about.",
      "The longest sentence in the passage.",
      "A new ending for the passage.",
    ],
    answer: "What the whole passage is mostly about.",
    explanation: "The main idea should describe the whole passage, not one detail.",
  });
  assert.equal(created.response.status, 201);
  assert.match(created.body.data.prompt, /main idea/);

  const createdDetail = await getJson(`/api/v1/questions/${created.body.data.id}`, teacherCookie);
  assert.equal(createdDetail.options.length, 4);
  assert.equal(createdDetail.topic, "Main idea");

  const questionBankPage = await fetch(`${baseUrl}/question-bank`, {
    headers: { cookie: teacherCookie },
  });
  assert.equal(questionBankPage.status, 200);
  assert.match(await questionBankPage.text(), /Which fraction is equivalent/);

  const newQuestionPage = await fetch(`${baseUrl}/question-bank/new?classId=class-p3-english`, {
    headers: { cookie: teacherCookie },
  });
  assert.equal(newQuestionPage.status, 200);
  assert.match(await newQuestionPage.text(), /New Question/);

  const detailPage = await fetch(`${baseUrl}/question-bank/question-p4-equivalent-fractions`, {
    headers: { cookie: teacherCookie },
  });
  assert.equal(detailPage.status, 200);
  assert.match(await detailPage.text(), /Use in assessment/);
});

test("admin membership can view all questions in the active workspace", async () => {
  const adminCookie = await login("admin@truth.test", "password");
  const questions = await getJson("/api/v1/teacher/questions", adminCookie);
  const questionIds = questions.questions.map((question) => question.id);

  assert.ok(questionIds.includes("question-p5-evaporation"));

  const scienceQuestion = await fetchJson(
    "/api/v1/questions/question-p5-evaporation",
    adminCookie,
  );
  assert.equal(scienceQuestion.response.status, 200);
  assert.match(scienceQuestion.body.data.prompt, /sunny day/);
});

test("timetable slice scopes teacher schedule events", async () => {
  const unauthenticated = await fetch(`${baseUrl}/api/v1/teacher/timetable`);
  assert.equal(unauthenticated.status, 401);

  const teacherCookie = await login("mrs.adeyemi@truth.test", "password");
  const timetable = await getJson(
    "/api/v1/teacher/timetable?date=2026-07-16",
    teacherCookie,
  );
  const eventIds = timetable.events.map((event) => event.id);

  assert.deepEqual(eventIds, [
    "timetable-staff-briefing",
    "timetable-p4-fractions",
    "timetable-p3-reading",
    "timetable-p4-quick-check",
  ]);

  const assignedEvent = await fetchJson(
    "/api/v1/timetable/events/timetable-p4-fractions",
    teacherCookie,
  );
  assert.equal(assignedEvent.response.status, 200);
  assert.equal(assignedEvent.body.data.title, "Equivalent Fractions");
  assert.equal(assignedEvent.body.data.lessonPlanHref, "/lesson-planner/lesson-p4-fractions");

  const unassignedEvent = await fetchJson(
    "/api/v1/timetable/events/timetable-p5-practical",
    teacherCookie,
  );
  assert.equal(unassignedEvent.response.status, 403);

  const crossTenantEvent = await fetchJson(
    "/api/v1/timetable/events/timetable-river-community",
    teacherCookie,
  );
  assert.equal(crossTenantEvent.response.status, 404);

  const invalidDate = await fetchJson(
    "/api/v1/teacher/timetable?date=July-16",
    teacherCookie,
  );
  assert.equal(invalidDate.response.status, 400);

  const timetablePage = await fetch(`${baseUrl}/timetable`, {
    headers: { cookie: teacherCookie },
  });
  assert.equal(timetablePage.status, 200);
  assert.match(await timetablePage.text(), /Equivalent Fractions/);

  const detailPage = await fetch(`${baseUrl}/timetable/timetable-p4-fractions`, {
    headers: { cookie: teacherCookie },
  });
  assert.equal(detailPage.status, 200);
  assert.match(await detailPage.text(), /Preparation Notes/);
});

test("admin membership can view all timetable events in the active workspace", async () => {
  const adminCookie = await login("admin@truth.test", "password");
  const timetable = await getJson("/api/v1/teacher/timetable", adminCookie);
  const eventIds = timetable.events.map((event) => event.id);

  assert.ok(eventIds.includes("timetable-p5-practical"));

  const scienceEvent = await fetchJson(
    "/api/v1/timetable/events/timetable-p5-practical",
    adminCookie,
  );
  assert.equal(scienceEvent.response.status, 200);
  assert.equal(scienceEvent.body.data.title, "Evaporation Practical Setup");
});

test("academic calendar slice scopes teacher milestones", async () => {
  const unauthenticated = await fetch(`${baseUrl}/api/v1/teacher/academic-calendar`);
  assert.equal(unauthenticated.status, 401);

  const teacherCookie = await login("mrs.adeyemi@truth.test", "password");
  const calendar = await getJson(
    "/api/v1/teacher/academic-calendar?from=2026-07-16",
    teacherCookie,
  );
  const eventIds = calendar.events.map((event) => event.id);

  assert.ok(eventIds.includes("calendar-first-term"));
  assert.ok(eventIds.includes("calendar-p4-fractions-check"));
  assert.ok(eventIds.includes("calendar-report-deadline"));
  assert.ok(eventIds.includes("calendar-teacher-pacing"));
  assert.ok(!eventIds.includes("calendar-p5-practical-review"));

  const assignedEvent = await fetchJson(
    "/api/v1/academic-calendar/events/calendar-p4-fractions-check",
    teacherCookie,
  );
  assert.equal(assignedEvent.response.status, 200);
  assert.equal(assignedEvent.body.data.title, "Fractions Quick Check");
  assert.equal(
    assignedEvent.body.data.timetableHref,
    "/timetable/timetable-p4-quick-check",
  );
  assert.equal(assignedEvent.body.data.assessmentHref, "/assessments/assessment-p4-fractions");

  const unassignedEvent = await fetchJson(
    "/api/v1/academic-calendar/events/calendar-p5-practical-review",
    teacherCookie,
  );
  assert.equal(unassignedEvent.response.status, 403);

  const crossTenantEvent = await fetchJson(
    "/api/v1/academic-calendar/events/calendar-river-open-day",
    teacherCookie,
  );
  assert.equal(crossTenantEvent.response.status, 404);

  const invalidDate = await fetchJson(
    "/api/v1/teacher/academic-calendar?from=July-16",
    teacherCookie,
  );
  assert.equal(invalidDate.response.status, 400);

  const calendarPage = await fetch(`${baseUrl}/academic-calendar`, {
    headers: { cookie: teacherCookie },
  });
  assert.equal(calendarPage.status, 200);
  assert.match(await calendarPage.text(), /Fractions Quick Check/);

  const detailPage = await fetch(
    `${baseUrl}/academic-calendar/calendar-p4-fractions-check`,
    {
      headers: { cookie: teacherCookie },
    },
  );
  assert.equal(detailPage.status, 200);
  assert.match(await detailPage.text(), /Required Action/);
});

test("admin membership can view all academic calendar events in the active workspace", async () => {
  const adminCookie = await login("admin@truth.test", "password");
  const calendar = await getJson("/api/v1/teacher/academic-calendar", adminCookie);
  const eventIds = calendar.events.map((event) => event.id);

  assert.ok(eventIds.includes("calendar-p5-practical-review"));

  const scienceEvent = await fetchJson(
    "/api/v1/academic-calendar/events/calendar-p5-practical-review",
    adminCookie,
  );
  assert.equal(scienceEvent.response.status, 200);
  assert.equal(scienceEvent.body.data.title, "Science Practical Review");
});

test("resources slice scopes teacher library materials", async () => {
  const unauthenticated = await fetch(`${baseUrl}/api/v1/teacher/resources`);
  assert.equal(unauthenticated.status, 401);

  const teacherCookie = await login("mrs.adeyemi@truth.test", "password");
  const resources = await getJson("/api/v1/teacher/resources", teacherCookie);
  const resourceIds = resources.resources.map((resource) => resource.id);

  assert.ok(resourceIds.includes("resource-p4-fractions-worksheet"));
  assert.ok(resourceIds.includes("resource-p3-comprehension-pack"));
  assert.ok(resourceIds.includes("resource-p4-exit-ticket"));
  assert.ok(resourceIds.includes("resource-school-report-guide"));
  assert.ok(!resourceIds.includes("resource-p5-safety-guide"));

  const assignedResource = await fetchJson(
    "/api/v1/resources/resource-p4-fractions-worksheet",
    teacherCookie,
  );
  assert.equal(assignedResource.response.status, 200);
  assert.equal(assignedResource.body.data.title, "Fractions Revision Worksheet");
  assert.equal(assignedResource.body.data.lessonPlanHref, "/lesson-planner/lesson-p4-fractions");
  assert.equal(assignedResource.body.data.assessmentHref, "/assessments/assessment-p4-fractions");

  const unassignedResource = await fetchJson(
    "/api/v1/resources/resource-p5-safety-guide",
    teacherCookie,
  );
  assert.equal(unassignedResource.response.status, 403);

  const crossTenantResource = await fetchJson(
    "/api/v1/resources/resource-river-community-pack",
    teacherCookie,
  );
  assert.equal(crossTenantResource.response.status, 404);

  const resourcesPage = await fetch(`${baseUrl}/resources`, {
    headers: { cookie: teacherCookie },
  });
  assert.equal(resourcesPage.status, 200);
  assert.match(await resourcesPage.text(), /Fractions Revision Worksheet/);

  const detailPage = await fetch(`${baseUrl}/resources/resource-p4-fractions-worksheet`, {
    headers: { cookie: teacherCookie },
  });
  assert.equal(detailPage.status, 200);
  assert.match(await detailPage.text(), /Resource Brief/);
});

test("admin membership can view all resources in the active workspace", async () => {
  const adminCookie = await login("admin@truth.test", "password");
  const resources = await getJson("/api/v1/teacher/resources", adminCookie);
  const resourceIds = resources.resources.map((resource) => resource.id);

  assert.ok(resourceIds.includes("resource-p5-safety-guide"));

  const scienceResource = await fetchJson(
    "/api/v1/resources/resource-p5-safety-guide",
    adminCookie,
  );
  assert.equal(scienceResource.response.status, 200);
  assert.equal(scienceResource.body.data.title, "Science Practical Safety Guide");
});

test("gradebook slice records scores with the same tenant and assignment rules", async () => {
  const unauthenticated = await fetch(`${baseUrl}/api/v1/teacher/gradebooks`);
  assert.equal(unauthenticated.status, 401);

  const teacherCookie = await login("mrs.adeyemi@truth.test", "password");
  const gradebooks = await getJson("/api/v1/teacher/gradebooks", teacherCookie);
  const gradebookIds = gradebooks.gradebooks.map((gradebook) => gradebook.assessmentId);

  assert.ok(gradebookIds.includes("assessment-p4-fractions"));
  assert.ok(gradebookIds.includes("assessment-p3-comprehension"));
  assert.ok(!gradebookIds.includes("assessment-p5-matter"));

  const assignedSheet = await fetchJson(
    "/api/v1/gradebooks/assessment-p4-fractions",
    teacherCookie,
  );
  assert.equal(assignedSheet.response.status, 200);
  assert.equal(assignedSheet.body.data.assessmentTitle, "Fractions Quick Check");
  assert.equal(assignedSheet.body.data.learners.length, 3);

  const unassignedSheet = await fetchJson(
    "/api/v1/gradebooks/assessment-p5-matter",
    teacherCookie,
  );
  assert.equal(unassignedSheet.response.status, 403);

  const crossTenantSheet = await fetchJson(
    "/api/v1/gradebooks/assessment-river-community",
    teacherCookie,
  );
  assert.equal(crossTenantSheet.response.status, 404);

  const invalidScore = await postJson(
    "/api/v1/gradebooks/assessment-p4-fractions",
    teacherCookie,
    {
      scores: [{ learnerId: "learner-ada", status: "scored", score: 30 }],
    },
  );
  assert.equal(invalidScore.response.status, 400);

  const invalidLearner = await postJson(
    "/api/v1/gradebooks/assessment-p4-fractions",
    teacherCookie,
    {
      scores: [{ learnerId: "learner-uche", status: "scored", score: 12 }],
    },
  );
  assert.equal(invalidLearner.response.status, 400);

  const unassignedSave = await postJson(
    "/api/v1/gradebooks/assessment-p5-matter",
    teacherCookie,
    {
      scores: [{ learnerId: "learner-uche", status: "scored", score: 20 }],
    },
  );
  assert.equal(unassignedSave.response.status, 403);

  const saved = await postJson(
    "/api/v1/gradebooks/assessment-p3-comprehension",
    teacherCookie,
    {
      scores: [
        {
          learnerId: "learner-zara",
          status: "scored",
          score: 10,
          feedback: "Main idea is clearer with sentence support.",
        },
      ],
    },
  );
  assert.equal(saved.response.status, 200);
  assert.equal(saved.body.data.missingCount, 0);
  assert.equal(
    saved.body.data.learners.find((learner) => learner.learnerId === "learner-zara").score,
    10,
  );

  const gradebookPage = await fetch(`${baseUrl}/gradebook`, {
    headers: { cookie: teacherCookie },
  });
  assert.equal(gradebookPage.status, 200);
  assert.match(await gradebookPage.text(), /Fractions Quick Check/);

  const sheetPage = await fetch(`${baseUrl}/gradebook/assessment-p4-fractions`, {
    headers: { cookie: teacherCookie },
  });
  assert.equal(sheetPage.status, 200);
  assert.match(await sheetPage.text(), /Save scores/);
});

test("admin membership can view all gradebook sheets in the active workspace", async () => {
  const adminCookie = await login("admin@truth.test", "password");
  const gradebooks = await getJson("/api/v1/teacher/gradebooks", adminCookie);
  const gradebookIds = gradebooks.gradebooks.map((gradebook) => gradebook.assessmentId);

  assert.ok(gradebookIds.includes("assessment-p5-matter"));

  const scienceSheet = await fetchJson(
    "/api/v1/gradebooks/assessment-p5-matter",
    adminCookie,
  );
  assert.equal(scienceSheet.response.status, 200);
  assert.equal(scienceSheet.body.data.assessmentTitle, "Matter and Change Practical Evidence");
});

test("reports slice prepares class comments with the same tenant and assignment rules", async () => {
  const unauthenticated = await fetch(`${baseUrl}/api/v1/teacher/reports`);
  assert.equal(unauthenticated.status, 401);

  const teacherCookie = await login("mrs.adeyemi@truth.test", "password");
  const reports = await getJson("/api/v1/teacher/reports", teacherCookie);
  const reportIds = reports.reports.map((report) => report.classId);

  assert.ok(reportIds.includes("class-p4-math"));
  assert.ok(reportIds.includes("class-p3-english"));
  assert.ok(!reportIds.includes("class-p5-science"));

  const assignedReport = await fetchJson("/api/v1/reports/class-p4-math", teacherCookie);
  assert.equal(assignedReport.response.status, 200);
  assert.equal(assignedReport.body.data.classDisplayName, "Primary 4 Mathematics");
  assert.equal(assignedReport.body.data.learners.length, 3);

  const unassignedReport = await fetchJson("/api/v1/reports/class-p5-science", teacherCookie);
  assert.equal(unassignedReport.response.status, 403);

  const crossTenantReport = await fetchJson(
    "/api/v1/reports/class-river-history",
    teacherCookie,
  );
  assert.equal(crossTenantReport.response.status, 404);

  const invalidComment = await postJson("/api/v1/reports/class-p4-math", teacherCookie, {
    comments: [
      { learnerId: "learner-uche", status: "ready", comment: "" },
      { learnerId: "learner-kene", status: "ready", comment: "" },
    ],
  });
  assert.equal(invalidComment.response.status, 400);

  const malformedPayload = await postJson("/api/v1/reports/class-p4-math", teacherCookie, {
    comments: [],
  });
  assert.equal(malformedPayload.response.status, 400);

  const unassignedSave = await postJson("/api/v1/reports/class-p5-science", teacherCookie, {
    comments: [
      {
        learnerId: "learner-uche",
        status: "ready",
        comment: "Uche records observations carefully.",
      },
    ],
  });
  assert.equal(unassignedSave.response.status, 403);

  const saved = await postJson("/api/v1/reports/class-p3-english", teacherCookie, {
    comments: [
      {
        learnerId: "learner-zara",
        status: "ready",
        comment: "Zara is building confidence with main idea evidence.",
      },
    ],
  });
  assert.equal(saved.response.status, 200);
  assert.equal(
    saved.body.data.learners.find((learner) => learner.learnerId === "learner-zara")
      .commentStatus,
    "ready",
  );

  const reportsPage = await fetch(`${baseUrl}/reports`, {
    headers: { cookie: teacherCookie },
  });
  assert.equal(reportsPage.status, 200);
  assert.match(await reportsPage.text(), /Primary 4 Mathematics/);

  const detailPage = await fetch(`${baseUrl}/reports/class-p4-math`, {
    headers: { cookie: teacherCookie },
  });
  assert.equal(detailPage.status, 200);
  assert.match(await detailPage.text(), /Save comments/);
});

test("admin membership can view all reports in the active workspace", async () => {
  const adminCookie = await login("admin@truth.test", "password");
  const reports = await getJson("/api/v1/teacher/reports", adminCookie);
  const reportIds = reports.reports.map((report) => report.classId);

  assert.ok(reportIds.includes("class-p5-science"));

  const scienceReport = await fetchJson("/api/v1/reports/class-p5-science", adminCookie);
  assert.equal(scienceReport.response.status, 200);
  assert.equal(scienceReport.body.data.classDisplayName, "Primary 5 Basic Science");
});

test("approvals slice tracks review requests with teacher and reviewer scope", async () => {
  const unauthenticated = await fetch(`${baseUrl}/api/v1/teacher/approvals`);
  assert.equal(unauthenticated.status, 401);

  const teacherCookie = await login("mrs.adeyemi@truth.test", "password");
  const approvals = await getJson("/api/v1/teacher/approvals", teacherCookie);
  const approvalIds = approvals.approvals.map((approval) => approval.id);

  assert.ok(approvalIds.includes("approval-lesson-p3-reading"));
  assert.ok(approvalIds.includes("approval-assessment-p3-comprehension"));
  assert.ok(approvalIds.includes("approval-report-p4-math"));
  assert.ok(!approvalIds.includes("approval-lesson-p5-evaporation"));

  const assignedApproval = await fetchJson(
    "/api/v1/approvals/approval-assessment-p3-comprehension",
    teacherCookie,
  );
  assert.equal(assignedApproval.response.status, 200);
  assert.equal(assignedApproval.body.data.title, "Main Idea Exit Assessment");

  const unassignedApproval = await fetchJson(
    "/api/v1/approvals/approval-lesson-p5-evaporation",
    teacherCookie,
  );
  assert.equal(unassignedApproval.response.status, 403);

  const crossTenantApproval = await fetchJson(
    "/api/v1/approvals/approval-assessment-river-community",
    teacherCookie,
  );
  assert.equal(crossTenantApproval.response.status, 404);

  const teacherDecision = await postJson(
    "/api/v1/approvals/approval-assessment-p3-comprehension",
    teacherCookie,
    { action: "approve" },
  );
  assert.equal(teacherDecision.response.status, 403);

  const approvalsPage = await fetch(`${baseUrl}/approvals`, {
    headers: { cookie: teacherCookie },
  });
  assert.equal(approvalsPage.status, 200);
  assert.match(await approvalsPage.text(), /Main Idea Exit Assessment/);

  const detailPage = await fetch(`${baseUrl}/approvals/approval-report-p4-math`, {
    headers: { cookie: teacherCookie },
  });
  assert.equal(detailPage.status, 200);
  assert.match(await detailPage.text(), /Review Thread/);
});

test("admin membership can review approvals in the active workspace", async () => {
  const adminCookie = await login("admin@truth.test", "password");
  const approvals = await getJson("/api/v1/teacher/approvals", adminCookie);
  const approvalIds = approvals.approvals.map((approval) => approval.id);

  assert.ok(approvalIds.includes("approval-lesson-p5-evaporation"));

  const invalidDecision = await postJson(
    "/api/v1/approvals/approval-assessment-p3-comprehension",
    adminCookie,
    { action: "request_changes" },
  );
  assert.equal(invalidDecision.response.status, 400);

  const changesRequested = await postJson(
    "/api/v1/approvals/approval-assessment-p3-comprehension",
    adminCookie,
    {
      action: "request_changes",
      note: "Clarify the vocabulary support instructions before publishing.",
    },
  );
  assert.equal(changesRequested.response.status, 200);
  assert.equal(changesRequested.body.data.status, "changes_requested");
  assert.equal(changesRequested.body.data.notes.length, 1);

  const approved = await postJson(
    "/api/v1/approvals/approval-lesson-p3-reading",
    adminCookie,
    { action: "approve", note: "Ready for the reading block." },
  );
  assert.equal(approved.response.status, 200);
  assert.equal(approved.body.data.status, "approved");

  const lessonPlan = await getJson("/api/v1/lesson-plans/lesson-p3-reading", adminCookie);
  assert.equal(lessonPlan.status, "approved");

  const adminDetailPage = await fetch(`${baseUrl}/approvals/approval-lesson-p3-reading`, {
    headers: { cookie: adminCookie },
  });
  assert.equal(adminDetailPage.status, 200);
  assert.match(await adminDetailPage.text(), /Reviewer Decision/);
});

test("teacher tasks slice scopes queue items and updates task status", async () => {
  const unauthenticated = await fetch(`${baseUrl}/api/v1/teacher/tasks`);
  assert.equal(unauthenticated.status, 401);

  const teacherCookie = await login("mrs.adeyemi@truth.test", "password");
  const tasks = await getJson("/api/v1/teacher/tasks", teacherCookie);
  const taskIds = tasks.tasks.map((task) => task.id);

  assert.ok(taskIds.includes("task-p3-score-entry"));
  assert.ok(taskIds.includes("task-p4-revision-support"));
  assert.ok(taskIds.includes("task-p4-report-gap"));
  assert.ok(taskIds.includes("task-p3-assessment-review"));
  assert.ok(taskIds.includes("task-school-report-style-guide"));
  assert.ok(!taskIds.includes("task-p5-lab-check"));

  const assignedTask = await fetchJson(
    "/api/v1/tasks/task-p4-revision-support",
    teacherCookie,
  );
  assert.equal(assignedTask.response.status, 200);
  assert.equal(assignedTask.body.data.sourceHref, "/resources/resource-p4-fractions-worksheet");

  const unassignedTask = await fetchJson("/api/v1/tasks/task-p5-lab-check", teacherCookie);
  assert.equal(unassignedTask.response.status, 403);

  const crossTenantTask = await fetchJson(
    "/api/v1/tasks/task-river-community-cards",
    teacherCookie,
  );
  assert.equal(crossTenantTask.response.status, 404);

  const invalidStatus = await postJson(
    "/api/v1/tasks/task-p4-revision-support",
    teacherCookie,
    { status: "waiting" },
  );
  assert.equal(invalidStatus.response.status, 400);

  const updated = await postJson(
    "/api/v1/tasks/task-p4-revision-support",
    teacherCookie,
    { status: "done", note: "Worksheet assigned to the support group." },
  );
  assert.equal(updated.response.status, 200);
  assert.equal(updated.body.data.status, "done");
  assert.ok(updated.body.data.activities.length >= 2);

  const tasksPage = await fetch(`${baseUrl}/my-tasks`, {
    headers: { cookie: teacherCookie },
  });
  assert.equal(tasksPage.status, 200);
  assert.match(await tasksPage.text(), /Enter English summary scores/);

  const detailPage = await fetch(`${baseUrl}/my-tasks/task-p4-report-gap`, {
    headers: { cookie: teacherCookie },
  });
  assert.equal(detailPage.status, 200);
  assert.match(await detailPage.text(), /Save status/);
});

test("admin membership can view and update all tasks in the active workspace", async () => {
  const adminCookie = await login("admin@truth.test", "password");
  const tasks = await getJson("/api/v1/teacher/tasks", adminCookie);
  const taskIds = tasks.tasks.map((task) => task.id);

  assert.ok(taskIds.includes("task-p5-lab-check"));

  const scienceTask = await fetchJson("/api/v1/tasks/task-p5-lab-check", adminCookie);
  assert.equal(scienceTask.response.status, 200);
  assert.equal(scienceTask.body.data.classDisplayName, "Primary 5 Basic Science");

  const updated = await postJson("/api/v1/tasks/task-p5-lab-check", adminCookie, {
    status: "done",
    note: "Lab resources confirmed.",
  });
  assert.equal(updated.response.status, 200);
  assert.equal(updated.body.data.status, "done");
});

test("help centre slice scopes guides and support requests", async () => {
  const unauthenticated = await fetch(`${baseUrl}/api/v1/help`);
  assert.equal(unauthenticated.status, 401);

  const teacherCookie = await login("mrs.adeyemi@truth.test", "password");
  const help = await getJson("/api/v1/help", teacherCookie);
  const guideIds = help.guides.map((guide) => guide.id);
  const requestIds = help.requests.map((request) => request.id);

  assert.ok(guideIds.includes("guide-create-assessment"));
  assert.ok(guideIds.includes("guide-report-publishing"));
  assert.ok(!guideIds.includes("guide-river-local-onboarding"));
  assert.ok(requestIds.includes("support-gradebook-import"));
  assert.ok(requestIds.includes("support-template-branding"));
  assert.ok(!requestIds.includes("support-school-roster-access"));

  const assignedRequest = await fetchJson(
    "/api/v1/help/requests/support-gradebook-import",
    teacherCookie,
  );
  assert.equal(assignedRequest.response.status, 200);
  assert.equal(assignedRequest.body.data.title, "Gradebook import question");

  const adminRequest = await fetchJson(
    "/api/v1/help/requests/support-school-roster-access",
    teacherCookie,
  );
  assert.equal(adminRequest.response.status, 403);

  const crossTenantRequest = await fetchJson(
    "/api/v1/help/requests/support-river-onboarding",
    teacherCookie,
  );
  assert.equal(crossTenantRequest.response.status, 404);

  const invalidRequest = await postJson("/api/v1/help/requests", teacherCookie, {
    title: "Bug",
    summary: "Too short",
    category: "troubleshooting",
    priority: "medium",
  });
  assert.equal(invalidRequest.response.status, 400);

  const created = await postJson("/api/v1/help/requests", teacherCookie, {
    title: "Question about publishing reports",
    summary: "Please confirm whether draft comments are included in reviewer previews.",
    category: "reports",
    priority: "medium",
  });
  assert.equal(created.response.status, 201);
  assert.equal(created.body.data.status, "open");
  assert.equal(created.body.data.messages.length, 1);

  const updated = await postJson(
    "/api/v1/help/requests/support-gradebook-import",
    teacherCookie,
    { body: "I will import only score and status columns." },
  );
  assert.equal(updated.response.status, 200);
  assert.equal(updated.body.data.messages.length, 3);

  const helpPage = await fetch(`${baseUrl}/help`, {
    headers: { cookie: teacherCookie },
  });
  assert.equal(helpPage.status, 200);
  assert.match(await helpPage.text(), /Gradebook import question/);

  const detailPage = await fetch(`${baseUrl}/help/support-gradebook-import`, {
    headers: { cookie: teacherCookie },
  });
  assert.equal(detailPage.status, 200);
  assert.match(await detailPage.text(), /Request Conversation/);
});

test("support manager can view and resolve all support requests in the active workspace", async () => {
  const adminCookie = await login("admin@truth.test", "password");
  const help = await getJson("/api/v1/help", adminCookie);
  const requestIds = help.requests.map((request) => request.id);

  assert.ok(requestIds.includes("support-school-roster-access"));

  const adminRequest = await fetchJson(
    "/api/v1/help/requests/support-school-roster-access",
    adminCookie,
  );
  assert.equal(adminRequest.response.status, 200);
  assert.equal(adminRequest.body.data.createdByName, "Mr. Okafor");

  const resolved = await postJson(
    "/api/v1/help/requests/support-school-roster-access",
    adminCookie,
    {
      body: "Roster access is now confirmed for the new class teacher.",
      status: "resolved",
    },
  );
  assert.equal(resolved.response.status, 200);
  assert.equal(resolved.body.data.status, "resolved");
});

test("settings slice manages account preferences and workspace selection scope", async () => {
  const unauthenticated = await fetch(`${baseUrl}/api/v1/settings`);
  assert.equal(unauthenticated.status, 401);

  const teacherCookie = await login("mrs.adeyemi@truth.test", "password");
  const settings = await getJson("/api/v1/settings", teacherCookie);

  assert.equal(settings.user.email, "mrs.adeyemi@truth.test");
  assert.equal(settings.activeWorkspace.id, "school-truth");
  assert.equal(settings.permissions.canManageAccount, true);
  assert.equal(settings.preferences.weeklyDigest, true);

  const invalidSettings = await postJson("/api/v1/settings", teacherCookie, {
    emailNotifications: true,
    inAppNotifications: true,
    dueDateReminders: true,
    supportUpdates: true,
    weeklyDigest: true,
    density: "dense",
    highContrast: false,
    language: "en",
    timezone: "Africa/Lagos",
    aiConfirmationMode: "high_impact",
    aiSourceAccess: true,
  });
  assert.equal(invalidSettings.response.status, 400);

  const updated = await postJson("/api/v1/settings", teacherCookie, {
    emailNotifications: false,
    inAppNotifications: true,
    dueDateReminders: true,
    supportUpdates: false,
    weeklyDigest: false,
    density: "compact",
    highContrast: true,
    language: "en",
    timezone: "UTC",
    aiConfirmationMode: "always",
    aiSourceAccess: true,
  });
  assert.equal(updated.response.status, 200);
  assert.equal(updated.body.data.preferences.emailNotifications, false);
  assert.equal(updated.body.data.preferences.density, "compact");
  assert.equal(updated.body.data.preferences.timezone, "UTC");
  assert.equal(updated.body.data.preferences.aiConfirmationMode, "always");

  const forbiddenWorkspace = await postJson("/api/v1/workspaces/select", teacherCookie, {
    workspaceId: "school-river",
  });
  assert.equal(forbiddenWorkspace.response.status, 403);

  const settingsPage = await fetch(`${baseUrl}/settings`, {
    headers: { cookie: teacherCookie },
  });
  assert.equal(settingsPage.status, 200);
  const settingsHtml = await settingsPage.text();
  assert.match(settingsHtml, /Save settings/);
  assert.match(settingsHtml, /Truth International School/);
});

async function login(email, password) {
  const response = await fetch(`${baseUrl}/api/v1/auth/login`, {
    method: "POST",
    body: new URLSearchParams({ email, password }),
    redirect: "manual",
  });

  assert.equal(response.status, 303);
  return extractCookieHeader(response.headers);
}

async function getJson(path, cookie) {
  const { response, body } = await fetchJson(path, cookie);
  assert.equal(response.status, 200, JSON.stringify(body));
  return body.data;
}

async function fetchJson(path, cookie) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { cookie },
  });
  const body = await response.json();
  return { response, body };
}

async function postJson(path, cookie, payload) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      cookie,
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const body = await response.json();
  return { response, body };
}

async function waitForServer() {
  const deadline = Date.now() + 90_000;

  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Next dev exited early:\n${serverOutput}`);
    }

    try {
      const response = await fetch(`${baseUrl}/api/v1/teacher/classes`);
      if (response.status === 401) {
        return;
      }
    } catch {
      // Server is still starting.
    }

    await delay(750);
  }

  throw new Error(`Timed out waiting for Next dev:\n${serverOutput}`);
}

function extractCookieHeader(headers) {
  const getSetCookie = headers.getSetCookie?.bind(headers);
  const values = getSetCookie ? getSetCookie() : splitSetCookie(headers.get("set-cookie"));
  assert.ok(values.length > 0, "login response should set cookies");
  return values.map((value) => value.split(";")[0]).join("; ");
}

function splitSetCookie(header) {
  if (!header) {
    return [];
  }

  return header.split(/,(?=\s*[^;,=]+=)/);
}

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

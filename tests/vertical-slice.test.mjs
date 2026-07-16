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

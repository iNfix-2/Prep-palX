# Prep-palX

Prep Pal version 2: an academic operations workspace for teachers and schools.

## Current Build

- Next.js 16, React 19, TypeScript, Tailwind CSS 4
- Teacher dashboard scaffolded from the Prep Pal Stitch design system
- Ask Pal full-screen AI copilot route at `/ask-pal`
- Teacher workspace routes for classes, lesson planning, assessments, question bank, timetable, calendar, gradebook, attendance, resources, approvals, reports, tasks, help, and settings
- Builder flows for `/lesson-planner/new` and `/assessments/new`
- Mock API route handlers under `/api/...` for teacher overview, Ask Pal, workspace sections, and builders
- Local SVG icon set and offline-safe font fallbacks

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Checks

```bash
npx tsc --noEmit
npm run lint
npm run build
```

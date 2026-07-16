# Screen-to-API Integration Matrix

## Current Standard

Current API routes are mock-only and unversioned. Target production API should use `/api/v1/...` with consistent auth, tenant, errors, and DTOs.

## Matrix

| Screen | Route | Domain | Roles | Data Required | Read Ops | Write Ops | API Endpoints | Schemas | Permission | Required States | Current Status | Blocker |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Teacher Dashboard | `/` | Teaching ops | Teacher | teacher summary, schedule, tasks, progress | dashboard summary | none initially | `GET /api/v1/teacher/dashboard` | `TeacherDashboardDto` | `dashboard.view` | loading, empty, error, unauthorized | mock-only | auth/tenant/API |
| My Classes | `/classes` | Classes | Teacher | class id/name/subject/year/teacher/learner count/progress | list assigned classes | none | `GET /api/v1/teacher/classes` | `TeacherClassListItemDto[]` | `class.view_assigned` | loading, empty, error, unauthorized, forbidden | next vertical slice | auth/session/database |
| Class Overview | `/classes/[classId]` | Classes | Teacher/Admin | class details, learners, subject, attendance, tasks | class detail | future notes/tasks | `GET /api/v1/classes/{classId}` | `ClassOverviewDto` | `class.view_assigned` or `class.manage` | loading, error, unauthorized, forbidden | missing | route/API/model |
| Lesson Planner | `/lesson-planner` | Teaching ops | Teacher | lesson list/templates/status | list lessons | create/update later | `GET /api/v1/lessons` | `LessonPlanDto[]` | `lesson.view` | all async states | mock-only | lesson model |
| New Lesson Plan | `/lesson-planner/new` | Teaching ops | Teacher | classes, subjects, objectives, resources | load defaults | create draft | `POST /api/v1/lessons` | `CreateLessonRequest` | `lesson.create` | validation/submitting/errors | static form | validation/API |
| Assessments | `/assessments` | Assessment | Teacher/Reviewer | assessment drafts/review/published | list assessments | submit review later | `GET /api/v1/assessments` | `AssessmentSummaryDto[]` | `assessment.view` | all async states | mock-only | assessment model |
| New Assessment | `/assessments/new` | Assessment | Teacher | classes, subjects, items, marks | load config | create draft | `POST /api/v1/assessments` | `CreateAssessmentRequest` | `assessment.create` | validation/submitting/errors | static form | validation/API |
| Question Bank | `/question-bank` | Assessment | Teacher/Reviewer | questions, tags, review status | list/search questions | add/edit later | `GET /api/v1/questions` | `QuestionDto[]` | `question.view` | loading/empty/error/pagination | mock-only | question model |
| Gradebook | `/gradebook` | Gradebook | Teacher | result sheets, learners, scores | list gradebooks | update scores later | `GET /api/v1/gradebooks` | `GradebookDto[]` | `gradebook.view` | loading/large/error | mock-only | grade model |
| Attendance | `/attendance` | Attendance | Teacher | register sessions, learners | list/load register | submit attendance | `GET /api/v1/attendance/sessions`, `POST /api/v1/attendance/sessions` | `AttendanceSessionDto` | `attendance.record` | loading/empty/error/duplicate submit | mock-only | attendance model |
| Reports | `/reports` | Reporting | Teacher/Reviewer | readiness, report cards, comments | list report readiness | prepare/review later | `GET /api/v1/reports/readiness` | `ReportReadinessDto` | `report.prepare` | loading/partial data/error | mock-only | report model |
| Approvals | `/approvals` | Workflow | Reviewer | approval requests/reviewers/status | list approvals | approve/request changes | `GET /api/v1/approvals`, `POST /api/v1/approvals/{id}/actions` | `ApprovalRequestDto` | `assessment.moderate`/`report.review` | loading/empty/error/forbidden | mock-only | workflow model |
| Ask Pal | `/ask-pal` | AI assistant | Teacher | conversations/context/sources | list context/conversation | propose action | `GET /api/v1/ai/conversations`, `POST /api/v1/ai/proposals` | `AssistantConversationDto` | `ai.use` | loading/error/confirmation/forbidden | mock-only | AI boundaries/audit |

## Cross-Cutting API Requirements

- Pagination: class/question/grade/report lists.
- Filtering: academic year, term, subject, status.
- Sorting: name, due date, update date.
- Search: learner/class/question/resource lists.
- File upload: resources, assessment imports, report templates.
- Audit: attendance submissions, score changes, approvals, AI confirmations.


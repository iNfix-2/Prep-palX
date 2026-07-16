# Screen-to-API Integration Matrix

## Current Standard

Legacy prototype API routes are mock-only and unversioned. Integrated demo slices use `/api/v1/...` with consistent auth, tenant, errors, and DTOs; production APIs should preserve those boundaries.

## Matrix

| Screen | Route | Domain | Roles | Data Required | Read Ops | Write Ops | API Endpoints | Schemas | Permission | Required States | Current Status | Blocker |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Teacher Dashboard | `/` | Teaching ops | Teacher | teacher summary, schedule, tasks, progress | dashboard summary | none initially | `GET /api/v1/teacher/dashboard` | `TeacherDashboardDto` | `dashboard.view` | loading, empty, error, unauthorized | mock-only | auth/tenant/API |
| My Classes | `/classes` | Classes | Teacher | class id/name/subject/year/teacher/learner count/progress | list assigned classes | none | `GET /api/v1/teacher/classes` | `TeacherClassListItemDto[]` | `class.view_assigned` | loading, empty, error, unauthorized, forbidden | demo integrated | database |
| Class Overview | `/classes/[classId]` | Classes | Teacher/Admin | class details, learners, subject, attendance, tasks | class detail | future notes/tasks | `GET /api/v1/classes/{classId}` | `ClassOverviewDto` | `class.view_assigned` or `class.manage` | loading, error, unauthorized, forbidden | demo integrated | database |
| Lesson Planner | `/lesson-planner` | Teaching ops | Teacher/Admin | lesson list/templates/status | list lessons | create draft | `GET /api/v1/teacher/lesson-plans`, `POST /api/v1/lesson-plans` | `LessonPlanListItemDto[]`, `CreateLessonPlanDto` | `lesson.view` / `lesson.create` | loading, empty, error, unauthorized, forbidden | demo integrated | database |
| New Lesson Plan | `/lesson-planner/new` | Teaching ops | Teacher/Admin | classes, subjects, objectives, resources | load options | create draft | `POST /api/v1/lesson-plans` | `CreateLessonPlanDto` | `lesson.create` | validation/errors | demo integrated | database |
| Assessments | `/assessments` | Assessment | Teacher/Admin | assessment drafts/review/published | list assessments | create draft | `GET /api/v1/teacher/assessments`, `POST /api/v1/assessments` | `AssessmentListItemDto[]`, `CreateAssessmentDto` | `assessment.view` / `assessment.create` | loading, empty, error, unauthorized, forbidden | demo integrated | database |
| New Assessment | `/assessments/new` | Assessment | Teacher/Admin | classes, subjects, items, marks | load options | create draft | `POST /api/v1/assessments` | `CreateAssessmentDto` | `assessment.create` | validation/errors | demo integrated | database |
| Assessment Detail | `/assessments/[assessmentId]` | Assessment | Teacher/Admin | instructions, topics, items, marks, review notes | assessment detail | future submit/review | `GET /api/v1/assessments/{assessmentId}` | `AssessmentDetailDto` | `assessment.view` / `assessment.create` | loading, error, unauthorized, forbidden | demo integrated | database |
| Question Bank | `/question-bank` | Assessment | Teacher/Reviewer | questions, tags, review status | list/search questions | add/edit later | `GET /api/v1/questions` | `QuestionDto[]` | `question.view` | loading/empty/error/pagination | mock-only | question model |
| Gradebook | `/gradebook` | Gradebook | Teacher/Admin | result sheets, learners, scores | list gradebooks | none | `GET /api/v1/teacher/gradebooks` | `GradebookSheetSummaryDto[]` | `gradebook.view` / `assessment.mark` | loading, empty, error, unauthorized, forbidden | demo integrated | database |
| Gradebook Sheet | `/gradebook/[assessmentId]` | Gradebook | Teacher/Admin | assessment, learners, scores, feedback | gradebook detail | save scores | `GET /api/v1/gradebooks/{assessmentId}`, `POST /api/v1/gradebooks/{assessmentId}` | `GradebookSheetDto`, `SaveGradebookScoresRequestDto` | `gradebook.view` / `assessment.mark` | validation/errors | demo integrated | database |
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

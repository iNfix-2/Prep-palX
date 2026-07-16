# Domain Architecture

The project should evolve as a modular monolith unless future repository evidence requires a different architecture. UI routes should not define backend boundaries. Domains below are business boundaries.

## 1. Identity and Tenancy

Responsibilities: users, authentication, schools/workspaces, invitations, memberships, sessions, active workspace.

Main entities: `User`, `School`, `Workspace`, `Membership`, `Invitation`, `Session`.

Relationships: every protected domain depends on active membership and tenant context.

API boundaries: `/api/v1/me`, `/api/v1/auth/*`, `/api/v1/workspaces`, `/api/v1/workspaces/select`.

Permissions: authentication required; membership required for tenant access.

Risks/questions: provider choice, password policy, email verification, session store, multi-school UX.

## 2. Access Control

Responsibilities: roles, permissions, role assignments, delegated access, audit records.

Main entities: `Role`, `Permission`, `RoleAssignment`, `Delegation`, `AuditLog`.

API boundaries: role management and permission-check services; never UI-only checks.

Risks/questions: custom school roles, role inheritance, permission naming lifecycle.

## 3. Academic Structure

Responsibilities: years, terms, grade levels, subjects, departments, classes, class-subject relationships.

Main entities: `AcademicYear`, `Term`, `GradeLevel`, `Subject`, `Department`, `Class`, `ClassSubject`.

Dependencies: identity/tenant, people/staff assignments, scheduling.

## 4. People and Enrolment

Responsibilities: staff, teachers, learners, guardians, teacher assignments, learner enrolments.

Main entities: `StaffProfile`, `TeacherProfile`, `Learner`, `Guardian`, `TeacherAssignment`, `LearnerEnrolment`.

Risks/questions: learner privacy, guardian access, staff who teach across departments.

## 5. Teaching and Classroom Operations

Responsibilities: dashboard, classroom records, lesson planning, homework, teacher tasks.

Main entities: `LessonPlan`, `ClassroomRecord`, `Homework`, `TeacherTask`.

APIs: assigned classes, lesson plans, classroom activity records, tasks.

## 6. Assessment

Responsibilities: questions, assessment definitions, versions, scheduling, submissions, marking, moderation, approval.

Main entities: `Question`, `QuestionVersion`, `Assessment`, `AssessmentVersion`, `AssessmentItem`, `Submission`, `Mark`, `ModerationRecord`.

Risks: auditability of grade changes and AI-generated questions.

## 7. Gradebook and Results

Responsibilities: entries, weighting rules, calculations, analysis.

Main entities: `GradebookEntry`, `GradeScale`, `WeightingRule`, `ResultCalculation`, `ResultSnapshot`.

Dependencies: assessment, learners, reporting.

## 8. Attendance

Responsibilities: sessions, records, summaries, reports.

Main entities: `AttendanceSession`, `AttendanceRecord`, `AttendanceSummary`.

Permission examples: `attendance.record`, `attendance.view_reports`.

## 9. Behaviour and Engagement

Responsibilities: behaviour records, psychomotor assessments, incidents, parent contact, engagement notes.

Main entities: `BehaviourRecord`, `PsychomotorAssessment`, `Incident`, `ParentContactRecord`.

Risks: sensitive learner data and retention rules.

## 10. Reporting

Responsibilities: report templates, report cards, comments, review workflows, publishing, result sheets.

Main entities: `ReportTemplate`, `ReportCard`, `TeacherComment`, `ReportReview`, `ReportPublication`.

## 11. Scheduling

Responsibilities: timetables, timetable rules, calendar events, academic calendar.

Main entities: `Timetable`, `TimetableRule`, `TimetableSlot`, `CalendarEvent`.

## 12. Workflow and Approvals

Responsibilities: approval requests, review steps, reviewer assignments, delegations, transitions.

Main entities: `ApprovalRequest`, `ApprovalStep`, `ReviewerAssignment`, `StatusTransition`.

## 13. Notifications

Responsibilities: in-app/email notifications, preferences, delivery history.

Main entities: `Notification`, `NotificationPreference`, `NotificationDelivery`.

## 14. Automation

Responsibilities: triggers, conditions, actions, execution history.

Main entities: `AutomationDefinition`, `AutomationTrigger`, `AutomationCondition`, `AutomationAction`, `AutomationRun`.

Rule: automation must call domain services, not bypass permissions or audit.

## 15. AI Assistant

Responsibilities: conversations, context permissions, generated content, proposed actions, confirmations, audit history.

Main entities: `AssistantConversation`, `AssistantMessage`, `GeneratedContent`, `ProposedAction`, `ActionConfirmation`.

Rule: AI proposes actions; domain services execute after validation and confirmation.

## 16. Support

Responsibilities: tickets, comments, help articles, categories.

Main entities: `SupportTicket`, `TicketComment`, `HelpArticle`, `HelpCategory`.

## 17. Account and Security

Responsibilities: preferences, accessibility, active sessions, password/security, notification settings.

Main entities: `UserPreference`, `AccessibilitySetting`, `ActiveSession`, `SecurityEvent`.

## Cross-Domain Events

Potential events:

- `attendance.submitted`
- `assessment.submitted_for_review`
- `assessment.approved`
- `gradebook.score_changed`
- `report.published`
- `ai.action_confirmed`
- `role.changed`

Events must include tenant context and actor context.


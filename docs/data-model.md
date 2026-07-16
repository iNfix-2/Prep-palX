# Preliminary Central Data Model

No existing database models or migrations are present. This document proposes the first stable model direction and must be refined before migrations are created.

## Core Tenancy Model

### School

Fields: `id`, `name`, `slug`, `status`, `timezone`, `createdAt`, `updatedAt`, `deletedAt`.

Relationships:

- Has many `Membership`.
- Has many `AcademicYear`, `Term`, `Subject`, `Class`, `Learner`, `StaffProfile`.
- Owns assessment, attendance, reporting, approval, notification, audit, AI, and automation records.

Indexes/constraints:

- Unique `slug`.
- Tenant-scoped unique names where appropriate.

### User

Fields: `id`, `email`, `displayName`, `emailVerifiedAt`, `status`, `createdAt`, `updatedAt`.

Relationships:

- Has many `Membership`.
- Has many `Session`.
- May have staff/guardian/learner profile links by tenant.

Rule: no single global role should determine school access.

### Membership

Fields: `id`, `schoolId`, `userId`, `status`, `joinedAt`, `createdAt`, `updatedAt`.

Relationships:

- Connects `User` and `School`.
- Has many `RoleAssignment`.

Constraints:

- Unique `(schoolId, userId)`.

## Academic Model

### AcademicYear

Belongs to `School`; has many `Term`.

Fields: `id`, `schoolId`, `name`, `startsOn`, `endsOn`, `status`.

### Term

Belongs to `School` and `AcademicYear`.

Fields: `id`, `schoolId`, `academicYearId`, `name`, `startsOn`, `endsOn`, `status`.

### Class

Belongs to `School` and `AcademicYear`.

Fields: `id`, `schoolId`, `academicYearId`, `gradeLevelId`, `displayName`, `room`, `status`, `version`, `createdAt`, `updatedAt`, `deletedAt`.

Relationships:

- Has many `ClassSubject`.
- Has many `TeacherAssignment`.
- Has many `LearnerEnrolment`.

Indexes:

- `(schoolId, academicYearId, gradeLevelId)`.
- `(schoolId, displayName)`.

### Learner

Belongs to `School`.

Fields: `id`, `schoolId`, `admissionNumber`, `firstName`, `lastName`, `status`, `createdAt`, `updatedAt`, `deletedAt`.

Relationships:

- Has enrolments, attendance records, assessment results, behaviour records, reports.

## Assessment and Results

### Assessment

Fields: `id`, `schoolId`, `classId`, `subjectId`, `termId`, `title`, `type`, `status`, `totalMarks`, `createdByMembershipId`, `version`, timestamps.

Relationships:

- Has versions/items/submissions/scores.
- May have approval requests.

### GradebookEntry

Fields: `id`, `schoolId`, `learnerId`, `classId`, `subjectId`, `assessmentId`, `score`, `maxScore`, `status`, `updatedByMembershipId`, timestamps.

Rules:

- Score changes are auditable.
- Use optimistic locking for concurrent score entry.

## Attendance

### AttendanceSession

Fields: `id`, `schoolId`, `classId`, `date`, `periodId`, `status`, `submittedByMembershipId`, timestamps.

Constraints:

- Unique `(schoolId, classId, date, periodId)`.

### AttendanceRecord

Fields: `id`, `schoolId`, `attendanceSessionId`, `learnerId`, `status`, `notes`, `updatedByMembershipId`, timestamps.

## Reporting

### Report

Fields: `id`, `schoolId`, `learnerId`, `termId`, `status`, `publishedAt`, `version`, timestamps.

Relationships:

- Aggregates assessment, attendance, behaviour, and comments.

## Workflow and Audit

### ApprovalRequest

Fields: `id`, `schoolId`, `targetType`, `targetId`, `status`, `requestedByMembershipId`, timestamps.

### AuditLog

Fields: `id`, `schoolId`, `actorMembershipId`, `action`, `resourceType`, `resourceId`, `requestId`, `metadata`, `createdAt`.

Never store secrets in audit metadata.

## Cross-Cutting Requirements

- Every tenant-owned record includes `schoolId` directly or through an unambiguous parent.
- All queries must verify membership and scope by school.
- Use soft deletion for users, classes, learners, staff, reports, and long-lived records.
- Use immutable history or audit trails for scores, attendance submissions, approvals, role changes, and AI confirmations.
- Store dates/times with clear timezone policy; school timezone belongs on `School`.
- Use indexes for tenant-filtered lists and frequently joined relationships.
- Use transactions for multi-step writes.


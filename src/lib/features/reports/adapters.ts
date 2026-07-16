import type {
  ClassReportDto,
  ClassReportView,
  ReportClassCardView,
  ReportClassSummaryDto,
  ReportsPageView,
  TeacherReportsResponseDto,
} from "@/lib/features/reports/types";

const statusView = {
  ready: { label: "Ready", tone: "approved" },
  needs_attention: { label: "Needs attention", tone: "review" },
  blocked: { label: "Blocked", tone: "draft" },
} as const;

export function toReportsPageView(dto: TeacherReportsResponseDto): ReportsPageView {
  return {
    workspaceName: dto.workspace.name,
    totalClasses: dto.reports.length,
    totalLearners: dto.reports.reduce((sum, report) => sum + report.learnerCount, 0),
    totalReadyLearners: dto.reports.reduce(
      (sum, report) => sum + report.readyLearnerCount,
      0,
    ),
    totalMissingScores: dto.reports.reduce(
      (sum, report) => sum + report.missingScoreCount,
      0,
    ),
    totalMissingComments: dto.reports.reduce(
      (sum, report) => sum + report.missingCommentCount,
      0,
    ),
    averageReadinessPercent:
      dto.reports.length > 0
        ? Math.round(
            dto.reports.reduce((sum, report) => sum + report.readinessPercent, 0) /
              dto.reports.length,
          )
        : 0,
    canPrepareReports: dto.permissions.canPrepareReports,
    canReviewReports: dto.permissions.canReviewReports,
    canUseAi: dto.permissions.canUseAi,
    reports: dto.reports.map(toReportClassCardView),
  };
}

export function toReportClassCardView(dto: ReportClassSummaryDto): ReportClassCardView {
  const status = statusView[dto.status];

  return {
    id: dto.id,
    href: `/reports/${dto.classId}`,
    title: dto.classDisplayName,
    subjectLabel: `${dto.subjectName} / ${dto.gradeName}`,
    room: dto.room,
    learnerLabel: `${dto.learnerCount} ${dto.learnerCount === 1 ? "learner" : "learners"}`,
    readyLabel: `${dto.readyLearnerCount}/${dto.learnerCount} ready`,
    missingScoreLabel: `${dto.missingScoreCount} missing scores`,
    commentLabel: `${dto.commentCount}/${dto.learnerCount} comments`,
    readinessPercent: dto.readinessPercent,
    averageScoreLabel:
      dto.averageScorePercent > 0 ? `${dto.averageScorePercent}% average` : "No scores yet",
    attendanceLabel: `${dto.averageAttendancePercent}% attendance`,
    statusLabel: status.label,
    statusTone: status.tone,
  };
}

export function toClassReportView(
  dto: ClassReportDto,
  canPrepareReports: boolean,
): ClassReportView {
  const status = statusView[dto.status];

  return {
    id: dto.id,
    classId: dto.classId,
    title: dto.classDisplayName,
    subjectLabel: `${dto.subjectName} / ${dto.gradeName}`,
    workspaceName: dto.workspace.name,
    academicSessionLabel: dto.academicSessionLabel,
    room: dto.room,
    currentUnit: dto.currentUnit,
    learnerCount: dto.learnerCount,
    readyLearnerCount: dto.readyLearnerCount,
    missingScoreCount: dto.missingScoreCount,
    missingCommentCount: dto.missingCommentCount,
    averageScoreLabel:
      dto.averageScorePercent > 0 ? `${dto.averageScorePercent}% average` : "No scores yet",
    attendanceLabel: `${dto.averageAttendancePercent}% attendance`,
    readinessPercent: dto.readinessPercent,
    statusLabel: status.label,
    statusTone: status.tone,
    canPrepareReports,
    learners: dto.learners,
  };
}

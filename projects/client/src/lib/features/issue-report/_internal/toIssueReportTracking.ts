import type { IssueReport } from '../models/IssueReport.ts';
import type { IssueReportTrackingType } from '../models/IssueReportTrackingType.ts';

export function toIssueReportTracking(
  report: IssueReport,
): IssueReportTrackingType {
  switch (report.kind) {
    case 'import':
      return { kind: 'import', source: report.source };
    case 'search':
      return { kind: 'search', source: report.mode };
  }
}

import type { ReportSubmission } from './ReportSubmission.ts';
import { validateImportReport } from './validateImportReport.ts';
import { validateSearchReport } from './validateSearchReport.ts';

export function validateReport(report: ReportSubmission) {
  switch (report.kind) {
    case 'import':
      return validateImportReport(report);
    case 'search':
      return validateSearchReport(report);
  }
}

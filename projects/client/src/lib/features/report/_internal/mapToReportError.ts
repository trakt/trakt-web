import { ReportError } from '../models/ReportError.ts';

const statusErrorMap: Record<number, ReportError> = {
  409: ReportError.AlreadyReported,
  429: ReportError.RateLimited,
};

export function mapToReportError(status: number): ReportError {
  return statusErrorMap[status] ?? ReportError.Unknown;
}

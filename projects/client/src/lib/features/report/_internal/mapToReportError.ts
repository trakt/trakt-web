import { ReportError } from '../models/ReportError.ts';

const STATUS_TO_ERROR: Record<number, ReportError> = {
  409: ReportError.AlreadyReported,
  429: ReportError.RateLimited,
};

export function mapToReportError(status: number): ReportError {
  return STATUS_TO_ERROR[status] ?? ReportError.Unknown;
}

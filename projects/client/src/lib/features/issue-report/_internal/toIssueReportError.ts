import { IssueReportError } from '../models/IssueReportError.ts';

const SIZE_REASONS = new Set([
  'too-many-files',
  'file-too-large',
  'total-too-large',
]);

export function toIssueReportError(reason: unknown): IssueReportError {
  return typeof reason === 'string' && SIZE_REASONS.has(reason)
    ? IssueReportError.TooLarge
    : IssueReportError.Unknown;
}

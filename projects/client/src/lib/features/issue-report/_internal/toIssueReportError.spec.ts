import { describe, expect, it } from 'vitest';
import { IssueReportError } from '../models/IssueReportError.ts';
import { toIssueReportError } from './toIssueReportError.ts';

describe('util: toIssueReportError', () => {
  it('should map size failures to too large', () => {
    expect(toIssueReportError('total-too-large')).toBe(
      IssueReportError.TooLarge,
    );
  });

  it('should map anything else to unknown', () => {
    expect(toIssueReportError('query-required')).toBe(IssueReportError.Unknown);
    expect(toIssueReportError(null)).toBe(IssueReportError.Unknown);
  });
});

import { describe, expect, it } from 'vitest';
import { ReportError } from '../models/ReportError.ts';
import { ReportReason } from '../models/ReportReason.ts';
import { ReportableType } from '../models/ReportableType.ts';
import { toReportTracking } from './toReportTracking.ts';

describe('util: toReportTracking', () => {
  it('should carry the type, reason and outcome without ids or titles', () => {
    expect(
      toReportTracking({
        params: { type: ReportableType.Movie, id: 1, title: 'Heretic' },
        reason: ReportReason.Duplicate,
        outcome: 'sent',
      }),
    ).toEqual({ type: 'movie', reason: 'duplicate', outcome: 'sent' });
  });

  it('should keep the error as the outcome', () => {
    expect(
      toReportTracking({
        params: { type: ReportableType.Comment, id: 1 },
        reason: ReportReason.Spam,
        outcome: ReportError.RateLimited,
      }).outcome,
    ).toBe('rate-limited');
  });

  it('should fall back to other when the reason is not offered for the type', () => {
    expect(
      toReportTracking({
        params: { type: ReportableType.User, id: 'someone' },
        reason: ReportReason.Spoilers,
        outcome: 'sent',
      }).reason,
    ).toBe('other');
  });
});

import { describe, expect, it } from 'vitest';
import { ReportableType } from '../models/ReportableType.ts';
import { ReportReason } from '../models/ReportReason.ts';
import { reasonsFor } from './reasonsFor.ts';

describe('reasonsFor', () => {
  it('returns the comment-specific reason set for Comment', () => {
    const result = reasonsFor(ReportableType.Comment);

    expect(result).toEqual([
      ReportReason.Spoilers,
      ReportReason.Abusive,
      ReportReason.Spam,
      ReportReason.Bigotry,
      ReportReason.Political,
      ReportReason.OffTopic,
      ReportReason.Duplicate,
      ReportReason.Other,
    ]);
  });

  it('returns the user reason set for User', () => {
    const result = reasonsFor(ReportableType.User);

    expect(result).toEqual([
      ReportReason.Spam,
      ReportReason.Adult,
      ReportReason.Language,
      ReportReason.Other,
    ]);
  });

  it('never returns an empty list', () => {
    for (const type of Object.values(ReportableType)) {
      expect(reasonsFor(type).length).toBeGreaterThan(0);
    }
  });
});

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

  it.each([
    ReportableType.Movie,
    ReportableType.Show,
    ReportableType.Season,
    ReportableType.Episode,
  ])('returns the shared media reason set for %s', (type) => {
    const result = reasonsFor(type);

    expect(result).toEqual([
      ReportReason.Duplicate,
      ReportReason.Remove,
      ReportReason.DataRefresh,
      ReportReason.Metadata,
      ReportReason.Adult,
      ReportReason.Runtime,
      ReportReason.Language,
      ReportReason.Spam,
      ReportReason.Tmdb,
      ReportReason.Other,
    ]);
  });

  it('returns the list reason set for List (no runtime, tmdb, data_refresh)', () => {
    const result = reasonsFor(ReportableType.List);

    expect(result).toEqual([
      ReportReason.Duplicate,
      ReportReason.Remove,
      ReportReason.Metadata,
      ReportReason.Adult,
      ReportReason.Language,
      ReportReason.Spam,
      ReportReason.Other,
    ]);
    expect(result).not.toContain(ReportReason.Runtime);
    expect(result).not.toContain(ReportReason.Tmdb);
    expect(result).not.toContain(ReportReason.DataRefresh);
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

import { describe, expect, it } from 'vitest';
import { filterCommentEntries, type CommentEntry } from './useUserComments.ts';

describe('filterCommentEntries', () => {
  const now = new Date('2026-03-19T12:00:00Z');

  it('filters entries within 14-day window', () => {
    const entries: CommentEntry[] = [
      { createdAt: new Date('2026-03-18'), type: 'movie' },
      { createdAt: new Date('2026-02-01'), type: 'show' },
    ];
    const result = filterCommentEntries(entries, now);
    expect(result).toHaveLength(1);
  });

  it('returns empty array for empty input', () => {
    expect(filterCommentEntries([], now)).toEqual([]);
  });

  it('includes entries exactly at cutoff boundary', () => {
    const entries: CommentEntry[] = [
      { createdAt: new Date('2026-03-05'), type: 'movie' },
    ];
    const result = filterCommentEntries(entries, now);
    expect(result).toHaveLength(1);
  });
});

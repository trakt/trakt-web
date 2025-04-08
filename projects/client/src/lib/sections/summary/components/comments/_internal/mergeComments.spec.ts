import type { MediaComment } from '$lib/requests/models/MediaComment.ts';
import type { Sentiments } from '$lib/requests/models/Sentiments.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { ShowSiloCommentsMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloCommentsMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { mergeComments } from './mergeComments.ts';

describe('mergeComments', () => {
  const mockComment: MediaComment = assertDefined(
    ShowSiloCommentsMappedMock[0],
  );

  const mockSentiments: Sentiments = {
    good: ['this is good'],
    bad: ['this is bad'],
  };

  it('should return array with only comments when no sentiments provided', () => {
    const result = mergeComments([mockComment]);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      type: 'comment',
      ...mockComment,
    });
  });

  it('should merge comments with sentiments when both provided', () => {
    const result = mergeComments([mockComment], mockSentiments);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      type: 'sentiments',
      id: -1,
      ...mockSentiments,
    });
    expect(result[1]).toEqual({
      type: 'comment',
      ...mockComment,
    });
  });

  it('should handle empty comments array', () => {
    const result = mergeComments([], mockSentiments);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      type: 'sentiments',
      id: -1,
      ...mockSentiments,
    });
  });

  it('should handle multiple comments', () => {
    const comments = [mockComment, { ...mockComment, id: 2 }];
    const result = mergeComments(comments, mockSentiments);

    expect(result).toHaveLength(3);
    expect(result.filter((item) => item.type === 'comment')).toHaveLength(2);
  });
});

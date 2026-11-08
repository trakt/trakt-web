import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { describe, expect, it } from 'vitest';
import { mediaAnticipatedRecommendedQuery } from './mediaAnticipatedRecommendedQuery.ts';

describe('mediaAnticipatedRecommendedQuery', () => {
  it.each(['movie', 'show'] as const)(
    'should refetch after hiding a recommended %s',
    (type) => {
      expect(mediaAnticipatedRecommendedQuery().queryKey).toContain(
        InvalidateAction.HideRecommended(type),
      );
    },
  );
});

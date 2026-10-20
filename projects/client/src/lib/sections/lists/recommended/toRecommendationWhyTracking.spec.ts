import type { RecommendationPeopleReason } from '$lib/requests/models/RecommendationPeopleReason.ts';
import type { RecommendationSource } from '$lib/requests/models/RecommendationSource.ts';
import { describe, expect, it } from 'vitest';
import { toRecommendationWhyTracking } from './toRecommendationWhyTracking.ts';

const person = {} as RecommendationPeopleReason;
const source = {} as RecommendationSource;

describe('util: toRecommendationWhyTracking', () => {
  it('should report people when a person reason is shown', () => {
    expect(
      toRecommendationWhyTracking({ people: [person], sources: [source] }),
    ).toEqual({ reason: 'people' });
  });

  it('should report titles when only watched titles are shown', () => {
    expect(
      toRecommendationWhyTracking({ people: [], sources: [source] }),
    ).toEqual({ reason: 'titles' });
  });

  it('should report empty when there is no reason', () => {
    expect(toRecommendationWhyTracking({ people: [], sources: [] })).toEqual({
      reason: 'empty',
    });
  });
});

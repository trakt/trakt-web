import { RecommendedMoviesResponseMock } from '$mocks/data/recommendations/response/RecommendedMoviesResponseMock.ts';
import { describe, expect, it } from 'vitest';
import { RecommendationsMovieResponseSchema } from '../models/RecommendationsResponse.ts';
import { mapToRecommendationPeopleReason } from './mapToRecommendationPeopleReason.ts';

const [base] = RecommendedMoviesResponseMock;
const person = {
  name: 'Jon Favreau',
  ids: { trakt: 16183, slug: 'jon-favreau' },
};

describe('mapToRecommendationPeopleReason', () => {
  it('maps the person, role, count and titles', () => {
    const [item] = RecommendationsMovieResponseSchema.parse([
      {
        ...base,
        people: [
          {
            person,
            role: 'directing',
            watched_roles: ['directing', 'acting'],
            watched_count: 8,
            titles: [{ movie: base?.movie }],
          },
        ],
      },
    ]);

    const reason = mapToRecommendationPeopleReason(item!.people![0]!);

    expect(reason.person.name).toBe('Jon Favreau');
    expect(reason.role).toBe('directing');
    expect(reason.watchedRoles).toEqual(['directing', 'acting']);
    expect(reason.watchedCount).toBe(8);
    expect(reason.titles.map((title) => title.mediaType)).toEqual(['movie']);
  });

  it('drops people without watched roles', () => {
    const [item] = RecommendationsMovieResponseSchema.parse([
      {
        ...base,
        people: [{ person, role: 'acting', watched_count: 2, titles: [] }],
      },
    ]);

    expect(item!.people).toBeUndefined();
  });

  it('drops a malformed people field instead of rejecting the list', () => {
    const [item] = RecommendationsMovieResponseSchema.parse([
      { ...base, people: [{ person, role: 'producing' }] },
    ]);

    expect(item?.people).toBeUndefined();
    expect(item?.movie.title).toBe(base?.movie.title);
  });
});

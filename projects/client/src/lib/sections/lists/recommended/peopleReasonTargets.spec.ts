import type { RecommendationPeopleReason } from '$lib/requests/models/RecommendationPeopleReason.ts';
import { PersonFergusonMappedMock } from '$mocks/data/people/mapped/PersonFergusonMappedMock.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { peopleReasonTargets } from './peopleReasonTargets.ts';

const reason: RecommendationPeopleReason = {
  person: PersonFergusonMappedMock,
  role: 'acting',
  watchedRoles: ['acting'],
  watchedCount: 2,
  titles: [
    { mediaType: 'movie', media: MovieHereticMappedMock },
    { mediaType: 'show', media: ShowSiloMappedMock },
  ],
};

describe('util: peopleReasonTargets', () => {
  it('should target every reason title', () => {
    expect(
      peopleReasonTargets(reason).map(({ id, type }) => ({ id, type })),
    ).toEqual([
      { id: MovieHereticMappedMock.id, type: 'movie' },
      { id: ShowSiloMappedMock.id, type: 'show' },
    ]);
  });

  it('should patch only the matching title', () => {
    const [, silo] = peopleReasonTargets(reason);
    const patched = silo!.apply(reason, 'Silo DE');

    expect(patched.titles.map(({ media }) => media.title)).toEqual([
      MovieHereticMappedMock.title,
      'Silo DE',
    ]);
  });
});

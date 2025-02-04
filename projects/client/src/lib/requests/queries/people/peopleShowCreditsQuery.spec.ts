import { PersonFergusonResponseMock } from '$mocks/data/people/response/PersonFergusonResponseMock.js';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { PersonFergusonShowCreditsMappedMock } from '../../../../mocks/data/people/mapped/PersonFergusonShowCreditsMappedMock.js';
import { peopleShowCreditsQuery } from './peopleShowCreditsQuery.ts';

describe('peopleShowCreditsQuery', () => {
  it('should query for show credits', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          peopleShowCreditsQuery({ slug: PersonFergusonResponseMock.ids.slug }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(PersonFergusonShowCreditsMappedMock);
  });
});

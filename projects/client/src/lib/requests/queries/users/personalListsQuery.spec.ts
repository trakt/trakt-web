import { PersonalListsMappedMock } from '$mocks/data/users/mapped/PersonalListsMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { personalListsQuery } from './personalListsQuery.ts';

describe('personalListsQuery', () => {
  it('should query list summary', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          personalListsQuery(),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(PersonalListsMappedMock);
  });
});

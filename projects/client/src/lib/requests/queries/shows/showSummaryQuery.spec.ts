// @ts-ignore TODO: (@seferturan): fix typings in vs code
import QueryTestBed from '$test/beds/query/QueryTestBed.svelte';

import { waitForQueryResult } from '$test/beds/query/waitForQueryResult.ts';
import { createQuery } from '@tanstack/svelte-query';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import { ShowSiloMappedMock } from '../../../../mocks/data/summary/shows/silo/ShowSiloMappedMock.ts';
import { showSummaryQuery } from './showSummaryQuery.ts';

describe('showSummaryQuery', () => {
  it('should query for Silo (2023)', async () => {
    render(QueryTestBed, {
      props: {
        queryFactory: () =>
          createQuery(
            showSummaryQuery({ slug: ShowSiloMappedMock.slug }),
          ),
        mapper: (response) => response?.data,
      },
    });

    const result = await waitForQueryResult();
    expect(result).to.deep.equal(ShowSiloMappedMock);
  });
});

import QueryTestBed from '$test/beds/query/QueryTestBed.svelte';

import { setLocale } from '$lib/features/i18n/index.ts';
import { ShowSiloJapaneseMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloJapaneseMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { waitForQueryResult } from '$test/beds/query/waitForQueryResult.ts';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import { useShow } from './useShow.ts';

describe('store: useShow', () => {
  it('should contain summary for Silo (2023)', async () => {
    render(QueryTestBed, {
      props: {
        queryFactory: () => useShow(ShowSiloMappedMock.slug).show,
      },
    });

    const result = await waitForQueryResult();
    expect(result).to.deep.equal(ShowSiloMappedMock);
  });

  it('should contain english information for Silo (2023)', async () => {
    render(QueryTestBed, {
      props: {
        queryFactory: () => useShow(ShowSiloMappedMock.slug).intl,
      },
    });

    const result = await waitForQueryResult();
    expect(result).to.include({
      'overview': ShowSiloMappedMock.overview,
      'tagline': ShowSiloMappedMock.tagline,
      'title': ShowSiloMappedMock.title,
    });
  });

  it('should contain japanese information for Silo (2023)', async () => {
    setLocale('ja-jp');

    render(QueryTestBed, {
      props: {
        queryFactory: () => useShow(ShowSiloMappedMock.slug).intl,
      },
    });

    const result = await waitForQueryResult();
    expect(result).to.deep.equal(ShowSiloJapaneseMappedMock);
  });
});

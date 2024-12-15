// @ts-ignore TODO: (@seferturan): fix typings in vs code
import QueryTestBed from '$test/beds/query/QueryTestBed.svelte';

import { ExtendedUserMappedMock } from '$mocks/data/users/ExtendedUserSettingsMappedMock.ts';
import { waitForQueryResult } from '$test/beds/query/waitForQueryResult.ts';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import { useUser } from './useUser.ts';

describe('store: useUser', () => {
  it('should contain the user profile', async () => {
    render(QueryTestBed, {
      props: {
        queryFactory: () => useUser().user,
      },
    });

    const result = await waitForQueryResult();
    expect(result).to.deep.equal(ExtendedUserMappedMock);
  });
});

import { StreamingSourcesMappedMock } from '$mocks/data/watchnow/mapped/StreamingSourcesMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { streamingSourcesQuery } from './streamingSourcesQuery.ts';

describe('streamingSourcesQuery', () => {
  it('should query all streaming sources', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          streamingSourcesQuery({}),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(StreamingSourcesMappedMock);
  });
});

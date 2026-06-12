import { BulkIntlMappedMock } from '$mocks/data/intl/mapped/BulkIntlMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { bulkIntlQuery } from './bulkIntlQuery.ts';

describe('bulkIntlQuery', () => {
  it('should map the v3 response into id-keyed title maps', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          bulkIntlQuery({
            language: 'es',
            region: 'ES',
            movieIds: [101, 202],
            showIds: [303],
            episodeIds: [404],
            enabled: true,
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(BulkIntlMappedMock);
  });

  it('should be disabled when no ids are supplied', () => {
    const options = bulkIntlQuery({
      language: 'es',
      region: 'ES',
      movieIds: [],
      showIds: [],
      episodeIds: [],
      enabled: true,
    });

    expect(options.enabled).to.equal(false);
  });

  it('should respect the enabled flag from the caller', () => {
    const options = bulkIntlQuery({
      language: 'es',
      region: 'ES',
      movieIds: [101],
      showIds: [],
      episodeIds: [],
      enabled: false,
    });

    expect(options.enabled).to.equal(false);
  });
});

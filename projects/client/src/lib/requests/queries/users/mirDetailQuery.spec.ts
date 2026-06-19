import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { map } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { mirDetailQuery } from './mirDetailQuery.ts';

describe('mirDetailQuery', () => {
  // Map to the query's `data` so the resolved value is the YirDetail itself
  // (runQuery's return type follows the factory's emission); the default
  // waitFor gates until the loaded detail is present.
  const detail = () =>
    runQuery({
      factory: () =>
        createTestBedQuery(
          mirDetailQuery({ slug: 'me', month: 5, year: 2025 }),
        ).pipe(map((query) => query.data)),
    });

  it('should map the streaming services (Month in Review only)', async () => {
    const result = await detail();

    expect(result?.streamingServices).to.deep.equal({
      country: 'us',
      services: [
        { source: 'netflix', name: 'Netflix', shows: 1, movies: 2, all: 3 },
        { source: 'hulu', name: 'Hulu', shows: 0, movies: 1, all: 1 },
      ],
    });
  });

  it('should map the first play to a media entry', async () => {
    const result = await detail();

    expect(result?.firstWatched?.type).to.equal('movie');
    expect(result?.firstWatched?.entry).to.deep.equal(MovieHereticMappedMock);
  });
});

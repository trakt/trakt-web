import { ShowRecapStoryMappedMock } from '$mocks/data/summary/season-recap/mapped/ShowRecapStoryMappedMock.ts';
import { ShowRecapStoryResponseMock } from '$mocks/data/summary/season-recap/response/ShowRecapStoryResponseMock.ts';
import { server } from '$mocks/server.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { showRecapStoryQuery } from './showRecapStoryQuery.ts';

const URL = 'http://localhost/v3/shows/severance/recap/story';

function query(enabled = true) {
  return createTestBedQuery(
    showRecapStoryQuery({ slug: 'severance', through: 2, enabled }),
  );
}

describe('showRecapStoryQuery', () => {
  it('should query the story up to a season', async () => {
    server.use(
      http.get(URL, () => HttpResponse.json(ShowRecapStoryResponseMock)),
    );

    const result = await runQuery({
      factory: () => query(),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(ShowRecapStoryMappedMock);
  });

  it('should resolve to nothing when the show has no story', async () => {
    server.use(http.get(URL, () => new HttpResponse(null, { status: 404 })));

    const result = await runQuery({
      factory: () => query(),
      mapper: (response) => response?.data,
      waitFor: (data) => data === null,
    });

    expect(result).toBeNull();
  });

  it('should stay idle while disabled', () => {
    const { enabled } = showRecapStoryQuery({
      slug: 'severance',
      through: 2,
      enabled: false,
    });

    expect(enabled).toBe(false);
  });
});

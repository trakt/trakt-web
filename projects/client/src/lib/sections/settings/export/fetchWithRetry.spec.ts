import { server } from '$mocks/server.ts';
import { delay, http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchWithRetry } from './fetchWithRetry.ts';

const PATH = 'users/mega-collector/collection/movies';
const ENDPOINT = `http://localhost/${PATH}`;

const FAST = { timeout: 50, retryDelay: 5, maxTry: 2 };

describe('fetchWithRetry', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should return the payload and the page count', async () => {
    server.use(
      http.get(ENDPOINT, () =>
        HttpResponse.json([{ type: 'movie' }], {
          headers: {
            'X-Pagination-Page': '3',
            'X-Pagination-Page-Count': '58',
          },
        })),
    );

    const result = await fetchWithRetry({ url: PATH, page: 3 });

    expect(result).to.deep.equal({
      json: [{ type: 'movie' }],
      paginationPageCount: 58,
    });
  });

  it('should fall back to a single page when the page count is garbage', async () => {
    server.use(
      http.get(ENDPOINT, () =>
        HttpResponse.json([], {
          headers: { 'X-Pagination-Page-Count': 'not-a-number' },
        })),
    );

    const result = await fetchWithRetry({ url: PATH });

    expect(result.paginationPageCount).to.equal(1);
  });

  it('should abort a stalled response instead of hanging forever', async () => {
    server.use(
      http.get(ENDPOINT, async () => {
        await delay('infinite');
        return HttpResponse.json([]);
      }),
    );

    const result = await fetchWithRetry({ url: PATH, ...FAST })
      .catch((error: Error) => error);

    expect((result as Error).name).to.equal('TimeoutError');
  });

  it('should not retry a permanently failing request', async () => {
    let calls = 0;
    server.use(
      http.get(ENDPOINT, () => {
        calls += 1;
        return HttpResponse.json({}, { status: 404 });
      }),
    );

    const result = await fetchWithRetry({ url: PATH, ...FAST })
      .catch((error: Error) => error);

    expect(calls).to.equal(1);
    expect((result as Error).message).to.equal('HTTP 404');
  });

  it('should retry a failed request and recover', async () => {
    let calls = 0;
    server.use(
      http.get(ENDPOINT, () => {
        calls += 1;
        if (calls === 1) {
          return HttpResponse.json({}, { status: 500 });
        }
        return HttpResponse.json([{ type: 'movie' }]);
      }),
    );

    const result = await fetchWithRetry({ url: PATH, ...FAST });

    expect(calls).to.equal(2);
    expect(result.json).to.deep.equal([{ type: 'movie' }]);
  });
});

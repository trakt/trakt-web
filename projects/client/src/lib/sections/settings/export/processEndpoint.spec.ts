import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { processEndpoint } from './processEndpoint.ts';

const PATH = 'users/mega-collector/collection/movies';
const ENDPOINT = `http://localhost/${PATH}`;

describe('processEndpoint', () => {
  it('should walk every page and report the requested page', async () => {
    server.use(
      http.get(ENDPOINT, ({ request }) => {
        const page = new URL(request.url).searchParams.get('page');
        return HttpResponse.json([{ page }], {
          headers: {
            'X-Pagination-Page': String(page),
            'X-Pagination-Page-Count': '3',
          },
        });
      }),
    );

    const pages: Array<number> = [];
    await processEndpoint(PATH, (_, { page }) => {
      pages.push(page);
    });

    expect(pages).to.deep.equal([1, 2, 3]);
  });

  it('should terminate when the page header is echoed stale', async () => {
    server.use(
      http.get(ENDPOINT, () =>
        HttpResponse.json([], {
          headers: {
            'X-Pagination-Page': '1',
            'X-Pagination-Page-Count': '4',
          },
        })),
    );

    const pages: Array<number> = [];
    await processEndpoint(PATH, (_, { page }) => {
      pages.push(page);
    });

    expect(pages).to.deep.equal([1, 2, 3, 4]);
  });

  it('should stop after a single page when the page count is garbage', async () => {
    server.use(
      http.get(ENDPOINT, () =>
        HttpResponse.json([], {
          headers: { 'X-Pagination-Page-Count': 'not-a-number' },
        })),
    );

    const pages: Array<number> = [];
    await processEndpoint(PATH, (_, { page }) => {
      pages.push(page);
    });

    expect(pages).to.deep.equal([1]);
  });

  it('should stop after a single page when there is nothing to paginate', async () => {
    server.use(http.get(ENDPOINT, () => HttpResponse.json([])));

    const pages: Array<number> = [];
    await processEndpoint(PATH, (_, { page }) => {
      pages.push(page);
    });

    expect(pages).to.deep.equal([1]);
  });
});

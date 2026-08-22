import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { PAGE_LIMIT } from './constants.ts';
import { processEndpoint } from './processEndpoint.ts';

const PATH = 'users/mega-collector/collection/movies';
const ENDPOINT = `http://localhost/${PATH}`;

const pageOf = (size: number) =>
  Array.from({ length: size }, (_, index) => ({ index }));

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
    await processEndpoint({
      path: PATH,
      onPage: (_, { page }) => {
        pages.push(page);
      },
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
    await processEndpoint({
      path: PATH,
      onPage: (_, { page }) => {
        pages.push(page);
      },
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
    await processEndpoint({
      path: PATH,
      onPage: (_, { page }) => {
        pages.push(page);
      },
    });

    expect(pages).to.deep.equal([1]);
  });

  it('should keep walking while full pages arrive past the reported count', async () => {
    const sizes: Record<string, number> = {
      '1': PAGE_LIMIT,
      '2': PAGE_LIMIT,
      '3': 10,
    };

    server.use(
      http.get(ENDPOINT, ({ request }) => {
        const page = new URL(request.url).searchParams.get('page') ?? '1';
        return HttpResponse.json(
          pageOf(sizes[page] ?? 0),
          { headers: { 'X-Pagination-Page-Count': '1' } },
        );
      }),
    );

    const pages: Array<number> = [];
    await processEndpoint({
      path: PATH,
      onPage: (_, { page }) => {
        pages.push(page);
      },
    });

    expect(pages).to.deep.equal([1, 2, 3]);
  });

  it('should not report a probed page that comes back empty', async () => {
    server.use(
      http.get(ENDPOINT, ({ request }) => {
        const page = new URL(request.url).searchParams.get('page') ?? '1';
        return HttpResponse.json(
          page === '1' ? pageOf(PAGE_LIMIT) : [],
          { headers: { 'X-Pagination-Page-Count': '1' } },
        );
      }),
    );

    const pages: Array<number> = [];
    await processEndpoint({
      path: PATH,
      onPage: (_, { page }) => {
        pages.push(page);
      },
    });

    expect(pages).to.deep.equal([1]);
  });

  it('should give up once it runs far past the reported page count', async () => {
    server.use(
      http.get(ENDPOINT, () =>
        HttpResponse.json(pageOf(PAGE_LIMIT), {
          headers: { 'X-Pagination-Page-Count': '1' },
        })),
    );

    await expect(processEndpoint({ path: PATH, onPage: () => {} })).rejects
      .toThrow(
        /past its reported page count/,
      );
  });

  it('should stop after a single page when there is nothing to paginate', async () => {
    server.use(http.get(ENDPOINT, () => HttpResponse.json([])));

    const pages: Array<number> = [];
    await processEndpoint({
      path: PATH,
      onPage: (_, { page }) => {
        pages.push(page);
      },
    });

    expect(pages).to.deep.equal([1]);
  });
});

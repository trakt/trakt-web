import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { fetchCatalogSlugs } from './fetchCatalogSlugs.ts';

const pagedResponse = (endpoint: string, pageCount: number) =>
  http.get(endpoint, ({ request }) => {
    const page = new URL(request.url).searchParams.get('page');

    return HttpResponse.json(
      [{
        title: `Title ${page}`,
        ids: { trakt: Number(page), slug: `slug-${page}` },
      }],
      { headers: { 'x-pagination-page-count': `${pageCount}` } },
    );
  });

describe('util: fetchCatalogSlugs', () => {
  it('should follow the reported page count', async () => {
    server.use(pagedResponse('http://localhost/shows/popular*', 3));

    const slugs = await fetchCatalogSlugs({ fetch, type: 'show' });

    expect(slugs).to.deep.equal(['slug-1', 'slug-2', 'slug-3']);
  });

  it('should stop at a single page when the api reports one', async () => {
    server.use(pagedResponse('http://localhost/movies/popular*', 1));

    const slugs = await fetchCatalogSlugs({ fetch, type: 'movie' });

    expect(slugs).to.deep.equal(['slug-1']);
  });

  it('should cap the pages it will request', async () => {
    server.use(pagedResponse('http://localhost/shows/popular*', 500));

    const slugs = await fetchCatalogSlugs({ fetch, type: 'show' });

    expect(slugs).to.have.length(8);
  });

  it('should return nothing when the first page fails', async () => {
    server.use(
      http.get(
        'http://localhost/shows/popular*',
        () => new HttpResponse(null, { status: 500 }),
      ),
    );

    const slugs = await fetchCatalogSlugs({ fetch, type: 'show' });

    expect(slugs).to.have.length(0);
  });
});

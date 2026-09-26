import { MEDIA_POSTER_PLACEHOLDER } from '$lib/utils/assets.ts';
import { server } from '$mocks/server.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { listFeaturedPeopleQuery } from './listFeaturedPeopleQuery.ts';

const listId = 42;
const readFeaturedPeople = () =>
  runQuery({
    factory: () => createTestBedQuery(listFeaturedPeopleQuery({ listId })),
    waitFor: (response) => response.isSuccess,
  }).then((response) => response.data);

describe('listFeaturedPeopleQuery', () => {
  it('should request the extension and map headshots and preserve ranking with compact person data', async () => {
    let requestedUrl: URL | undefined;
    server.use(
      http.get(`http://localhost/lists/${listId}`, ({ request }) => {
        requestedUrl = new URL(request.url);
        return HttpResponse.json({
          featured: [
            {
              name: 'Rebecca Ferguson',
              ids: { trakt: 2, slug: 'rebecca-ferguson' },
              images: {
                headshot: [
                  'https://walter.trakt.tv/images/people/2/headshots/medium/rebecca.webp',
                ],
                fanart: [],
              },
            },
            { name: 'Hugh Grant', ids: { trakt: 1, slug: 'hugh-grant' } },
          ],
        });
      }),
    );

    const result = await readFeaturedPeople();

    expect(requestedUrl?.searchParams.get('extended')).toBe('featured');
    expect(result?.map((person) => person.slug)).toEqual([
      'rebecca-ferguson',
      'hugh-grant',
    ]);
    expect(result?.map((person) => person.headshot.url.thumb)).toEqual([
      'https://walter.trakt.tv/images/people/2/headshots/thumb/rebecca.webp',
      MEDIA_POSTER_PLACEHOLDER,
    ]);
  });

  it.each([{ headshot: [], fanart: [] }, null, undefined])(
    'should use a placeholder when headshots are unavailable (%s)',
    async (images) => {
      server.use(
        http.get(`http://localhost/lists/${listId}`, () =>
          HttpResponse.json({
            featured: [{
              name: 'Hugh Grant',
              ids: { trakt: 1, slug: 'hugh-grant' },
              images,
            }],
          })),
      );

      const result = await readFeaturedPeople();
      expect(result?.[0]?.headshot.url.thumb).toBe(MEDIA_POSTER_PLACEHOLDER);
    },
  );

  it.each([[], null, undefined])(
    'should return no people for an empty or unavailable extension (%s)',
    async (featured) => {
      server.use(
        http.get(
          `http://localhost/lists/${listId}`,
          () => HttpResponse.json({ featured }),
        ),
      );

      expect(await readFeaturedPeople()).toEqual([]);
    },
  );

  it('should resolve to no data when the list has no content', async () => {
    server.use(
      http.get(
        `http://localhost/lists/${listId}`,
        () => new HttpResponse(null, { status: 204 }),
      ),
    );

    await expect(listFeaturedPeopleQuery({ listId }).execute()).resolves
      .toBeNull();
  });

  it('should reject failed requests instead of caching them as an empty list', async () => {
    server.use(
      http.get(
        `http://localhost/lists/${listId}`,
        () => new HttpResponse(null, { status: 503 }),
      ),
    );

    await expect(listFeaturedPeopleQuery({ listId }).execute()).rejects
      .toThrow();
  });
});

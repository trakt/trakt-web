import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { server } from '$mocks/server.ts';
import { captureInvalidations } from '$test/beds/query/captureInvalidations.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { http, HttpResponse } from 'msw';
import { valueObservable } from '$test/beds/store/valueObservable.ts';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useRecommendedBy } from './useRecommendedBy.ts';

const MUTES_URL = 'http://localhost/v3/shares/mutes';

describe('store: useRecommendedBy', () => {
  beforeEach(() => {
    setAuthorization(true);
  });

  it('should request the url of the show, movie or episode', async () => {
    const urls: string[] = [];
    server.use(
      http.get('http://localhost/v3/shares/recommended', ({ request }) => {
        urls.push(new URL(request.url).searchParams.get('url') ?? '');
        return new HttpResponse(null, { status: 404 });
      }),
    );

    await runQuery({
      factory: () =>
        useRecommendedBy(
          valueObservable({
            type: 'episode',
            slug: 'silo',
            season: 1,
            episode: 2,
          }),
        ).recommendedBy,
      waitFor: () => true,
    });

    await vi.waitFor(() => expect(urls).to.have.length(1));
    expect(urls.at(0)).to.contain('silo');
    expect(urls.at(0)).to.contain('seasons/1/episodes/2');
  });

  it('should be null when nobody recommended it', async () => {
    server.use(
      http.get(
        'http://localhost/v3/shares/recommended',
        () => new HttpResponse(null, { status: 404 }),
      ),
    );

    const result = await runQuery({
      factory: () =>
        useRecommendedBy(valueObservable({ type: 'show', slug: 'nobody-show' }))
          .recommendedBy,
      waitFor: (value) => value === null,
    });

    expect(result).to.equal(null);
  });

  it('should mute the sharer and invalidate the shares', async () => {
    const bodies: unknown[] = [];
    server.use(
      http.post(MUTES_URL, async ({ request }) => {
        bodies.push(await request.json());
        return new HttpResponse(null, { status: 200 });
      }),
    );
    const { muteSharer } = await renderStore(() =>
      useRecommendedBy(
        valueObservable({ type: 'movie', slug: 'heretic-2024' }),
      ),
    );

    let isMuted: boolean | undefined;
    const invalidations = await captureInvalidations(async () => {
      isMuted = await muteSharer(42);
    });

    expect(isMuted).to.equal(true);
    expect(bodies).to.deep.equal([{ sharer_id: 42 }]);
    expect(invalidations).toContain(InvalidateAction.Share.Mute);
  });

  it('should report a failed mute', async () => {
    server.use(
      http.post(MUTES_URL, () => new HttpResponse(null, { status: 500 })),
    );
    const { muteSharer } = await renderStore(() =>
      useRecommendedBy(
        valueObservable({ type: 'movie', slug: 'heretic-2024' }),
      ),
    );

    expect(await muteSharer(42)).to.equal(false);
  });
});

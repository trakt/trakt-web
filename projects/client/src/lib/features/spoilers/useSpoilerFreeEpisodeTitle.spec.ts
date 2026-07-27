import { episodeSubtitle } from '$lib/utils/intl/episodeSubtitle.ts';
import { clone } from '$lib/utils/object/clone.ts';
import { deepAssign } from '$lib/utils/object/deepAssign.ts';
import { EpisodeSiloMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloMappedMock.ts';
import { ExtendedUsersResponseMock } from '$mocks/data/users/response/ExtendedUserSettingsResponseMock.ts';
import { server } from '$mocks/server.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { waitForValue } from '$test/readable/waitForValue.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { useSpoilerFreeEpisodeTitle } from './useSpoilerFreeEpisodeTitle.ts';

// Neither show is in the watched-history mock, so episodes read as unwatched
// unless `markEpisodeWatched` puts one there.
const show = { id: 1337, title: 'Silo' };
const watchedShow = { id: 1338, title: 'Silo' };

function overrideShowSpoiler(shows: 'hide_title' | null) {
  const user = deepAssign(clone(ExtendedUsersResponseMock), {
    browsing: {
      spoilers: {
        actors: null,
        comments: null,
        episodes: null,
        movies: null,
        ratings: null,
        shows,
      },
    },
  });

  server.use(
    http.get(
      'http://localhost/users/settings',
      () => HttpResponse.json(user),
    ),
  );
}

function markEpisodeWatched() {
  server.use(
    http.get('http://localhost/users/me/watched/shows*', ({ request }) => {
      const page = Number(new URL(request.url).searchParams.get('page') ?? 1);

      if (page > 1) {
        return HttpResponse.json({});
      }

      return HttpResponse.json({
        [watchedShow.id]: {
          '100|1': {
            [EpisodeSiloMappedMock.id]: ['2024-12-27T16:28:32.000Z'],
          },
        },
      });
    }),
  );
}

function renderTitle(target = show) {
  return renderStore(() =>
    useSpoilerFreeEpisodeTitle({
      episode: EpisodeSiloMappedMock,
      show: target,
    })
  );
}

describe('store: useSpoilerFreeEpisodeTitle', () => {
  it('should surface the episode title when spoilers are not hidden', async () => {
    setAuthorization(true);
    overrideShowSpoiler(null);

    const title = await renderTitle();

    expect(await waitForValue(title, EpisodeSiloMappedMock.title))
      .toBe(EpisodeSiloMappedMock.title);
  });

  it('should mask the title with its season/episode label when spoilers are hidden', async () => {
    setAuthorization(true);
    overrideShowSpoiler('hide_title');

    const title = await renderTitle();
    const masked = episodeSubtitle(EpisodeSiloMappedMock);

    expect(await waitForValue(title, masked)).toBe(masked);
  });

  it('should surface the episode title for a watched episode when spoilers are hidden', async () => {
    setAuthorization(true);
    overrideShowSpoiler('hide_title');
    markEpisodeWatched();

    const title = await renderTitle(watchedShow);

    expect(await waitForValue(title, EpisodeSiloMappedMock.title))
      .toBe(EpisodeSiloMappedMock.title);
  });
});

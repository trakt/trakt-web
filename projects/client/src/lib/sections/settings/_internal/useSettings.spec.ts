import { Theme } from '$lib/features/theme/models/Theme.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { ExtendedUsersResponseMock } from '$mocks/data/users/response/ExtendedUserSettingsResponseMock.ts';
import { server } from '$mocks/server.ts';
import { captureInvalidations } from '$test/beds/query/captureInvalidations.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import { useSettings } from './useSettings.ts';

const SETTINGS_URL = 'http://localhost/users/settings';

function captureSettingsBodies(status = 200) {
  const bodies: unknown[] = [];
  server.use(
    http.put(SETTINGS_URL, async ({ request }) => {
      bodies.push(await request.json());
      return HttpResponse.json({}, { status });
    }),
  );

  return bodies;
}

describe('store: useSettings', () => {
  beforeEach(() => {
    setAuthorization(true);
  });

  it('should only expose genres that are known', async () => {
    server.use(
      http.get(SETTINGS_URL, () =>
        HttpResponse.json({
          ...ExtendedUsersResponseMock,
          browsing: {
            ...ExtendedUsersResponseMock.browsing,
            genres: {
              favorites: ['drama', 'not-a-real-genre'],
              disliked: ['horror', 'also-unknown'],
            },
          },
        }),
      ),
    );

    const genres = await runQuery({
      factory: () => useSettings().genres,
      waitFor: (value) => value.loved.length > 0,
    });

    expect(genres.loved).to.deep.equal(['drama']);
    expect(genres.disliked).to.deep.equal(['horror']);
  });

  it('should save the theme as a dark knight value', async () => {
    const bodies = captureSettingsBodies();
    const { theme } = await renderStore(() => useSettings());

    await theme.set(Theme.Dark);

    expect(bodies).to.deep.equal([{ browsing: { dark_knight: 'true' } }]);
  });

  it('should hide spoilers for every media type when enabled', async () => {
    const bodies = captureSettingsBodies();
    const { spoilers } = await renderStore(() => useSettings());
    const { set } = await runQuery({ factory: () => spoilers });

    await set(true);

    expect(bodies).to.deep.equal([
      {
        browsing: {
          spoilers: { episodes: 'hide', shows: 'hide', movies: 'hide' },
        },
      },
    ]);
  });

  it('should show spoilers for every media type when disabled', async () => {
    const bodies = captureSettingsBodies();
    const { spoilers } = await renderStore(() => useSettings());
    const { set } = await runQuery({ factory: () => spoilers });

    await set(false);

    expect(bodies).to.deep.equal([
      {
        browsing: {
          spoilers: { episodes: 'show', shows: 'show', movies: 'show' },
        },
      },
    ]);
  });

  it('should invert watch again into watch only once', async () => {
    const bodies = captureSettingsBodies();
    const { watchAgain } = await renderStore(() => useSettings());
    const { set } = await runQuery({ factory: () => watchAgain });

    await set(true);

    expect(bodies).to.deep.equal([{ browsing: { watch_only_once: false } }]);
  });

  it('should save loved and disliked genres', async () => {
    const bodies = captureSettingsBodies();
    const { setGenres } = await renderStore(() => useSettings());

    await setGenres({
      loved: ['drama'],
      disliked: ['horror'],
      action: 'genres',
    });

    expect(bodies).to.deep.equal([
      {
        browsing: {
          genres: { favorites: ['drama'], disliked: ['horror'] },
        },
      },
    ]);
  });

  it('should invalidate user settings after a successful save', async () => {
    captureSettingsBodies();
    const { locale } = await renderStore(() => useSettings());

    const invalidations = await captureInvalidations(() => locale.set('nl-NL'));

    expect(invalidations).toContain(InvalidateAction.User.Settings);
  });

  it('should not invalidate user settings when saving fails', async () => {
    captureSettingsBodies(500);
    const { locale } = await renderStore(() => useSettings());

    const invalidations = await captureInvalidations(() =>
      locale.set('nl-NL'),
    ).catch(() => []);

    expect(invalidations).not.toContain(InvalidateAction.User.Settings);
  });
});

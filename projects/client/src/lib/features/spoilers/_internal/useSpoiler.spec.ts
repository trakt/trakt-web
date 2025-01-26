import { clone } from '$lib/utils/object/clone';
import { deepAssign } from '$lib/utils/object/deepAssign';
import { ExtendedUsersResponseMock } from '$mocks/data/users/ExtendedUserSettingsResponseMock';
import { server } from '$mocks/server';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore';
import { waitForEmission } from '$test/readable/waitForEmission';
import { waitForValue } from '$test/readable/waitForValue';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { useSpoiler } from './useSpoiler';

describe('store: useSpoiler', () => {
  it('should return false when user is not authorized', async () => {
    setAuthorization(false);

    const { isSpoilerHidden } = await renderStore(() => useSpoiler());

    expect(await waitForEmission(isSpoilerHidden, 2)).toBe(false);
  });

  it('should return user preference when authorized', async () => {
    setAuthorization(true);

    const { isSpoilerHidden } = await renderStore(() => useSpoiler());

    expect(await waitForValue(isSpoilerHidden, true)).toBe(false);
  });

  it('should return true if shows contain `hide`', async () => {
    const user = deepAssign(
      clone(ExtendedUsersResponseMock),
      {
        browsing: {
          spoilers: {
            actors: null,
            comments: null,
            episodes: null,
            movies: null,
            ratings: null,
            shows: 'hide_title',
          },
        },
      },
    );

    server.use(
      http.get('http://localhost/users/settings', () => {
        return HttpResponse.json(user);
      }),
    );

    setAuthorization(true);

    const { isSpoilerHidden } = await renderStore(() => useSpoiler());

    expect(await waitForValue(isSpoilerHidden, true)).toBe(true);
  });

  it('should return true if movies contain `hide`', async () => {
    const user = deepAssign(
      clone(ExtendedUsersResponseMock),
      {
        browsing: {
          spoilers: {
            actors: null,
            comments: null,
            episodes: null,
            movies: 'hide',
            ratings: null,
            shows: null,
          },
        },
      },
    );

    server.use(
      http.get('http://localhost/users/settings', () => {
        return HttpResponse.json(user);
      }),
    );

    setAuthorization(true);

    const { isSpoilerHidden } = await renderStore(() => useSpoiler());

    expect(await waitForValue(isSpoilerHidden, true)).toBe(true);
  });

  it('should return true if episodes contain `hide`', async () => {
    const user = deepAssign(
      clone(ExtendedUsersResponseMock),
      {
        browsing: {
          spoilers: {
            actors: null,
            comments: null,
            episodes: 'hide',
            movies: null,
            ratings: null,
            shows: null,
          },
        },
      },
    );

    server.use(
      http.get('http://localhost/users/settings', () => {
        return HttpResponse.json(user);
      }),
    );

    setAuthorization(true);

    const { isSpoilerHidden } = await renderStore(() => useSpoiler());

    expect(await waitForValue(isSpoilerHidden, true)).toBe(true);
  });

  it('should return false if actors contain `hide`', async () => {
    const user = deepAssign(
      clone(ExtendedUsersResponseMock),
      {
        browsing: {
          spoilers: {
            actors: 'hide',
            comments: null,
            episodes: null,
            movies: null,
            ratings: null,
            shows: null,
          },
        },
      },
    );

    server.use(
      http.get('http://localhost/users/settings', () => {
        return HttpResponse.json(user);
      }),
    );

    setAuthorization(true);

    const { isSpoilerHidden } = await renderStore(() => useSpoiler());

    expect(await waitForValue(isSpoilerHidden, true)).toBe(false);
  });

  it('should return false if comments contain `hide`', async () => {
    const user = deepAssign(
      clone(ExtendedUsersResponseMock),
      {
        browsing: {
          spoilers: {
            actors: null,
            comments: 'hide',
            episodes: null,
            movies: null,
            ratings: null,
            shows: null,
          },
        },
      },
    );

    server.use(
      http.get('http://localhost/users/settings', () => {
        return HttpResponse.json(user);
      }),
    );

    setAuthorization(true);

    const { isSpoilerHidden } = await renderStore(() => useSpoiler());

    expect(await waitForValue(isSpoilerHidden, true)).toBe(false);
  });

  it('should return false if ratings contain `hide`', async () => {
    const user = deepAssign(
      clone(ExtendedUsersResponseMock),
      {
        browsing: {
          spoilers: {
            actors: null,
            comments: null,
            episodes: null,
            movies: null,
            ratings: 'hide',
            shows: null,
          },
        },
      },
    );

    server.use(
      http.get('http://localhost/users/settings', () => {
        return HttpResponse.json(user);
      }),
    );

    setAuthorization(true);

    const { isSpoilerHidden } = await renderStore(() => useSpoiler());

    expect(await waitForValue(isSpoilerHidden, true)).toBe(false);
  });
});

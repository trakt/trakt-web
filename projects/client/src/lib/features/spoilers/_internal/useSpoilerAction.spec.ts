import { SPOILER_CLASS_NAME } from '$lib/features/spoilers/constants.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { clone } from '$lib/utils/object/clone.ts';
import { deepAssign } from '$lib/utils/object/deepAssign.ts';
import { ExtendedUsersResponseMock } from '$mocks/data/users/response/ExtendedUserSettingsResponseMock.ts';
import { WatchedMoviesResponseMock } from '$mocks/data/users/response/WatchedMoviesResponseMock.ts';
import { server } from '$mocks/server.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { waitFor } from '@testing-library/svelte';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { useSpoilerAction } from './useSpoilerAction.ts';

describe('action: useSpoilerAction', () => {
  it('should add spoiler class when isSpoilerHidden is true', async () => {
    setAuthorization(true);

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

    const node = document.createElement('div');
    const { spoiler } = await renderStore(() =>
      useSpoilerAction({
        type: 'show',
        media: { id: 1337 },
      })
    );

    spoiler(node);

    await waitFor(() =>
      expect(node.classList.contains(SPOILER_CLASS_NAME)).toBe(true)
    );
  });

  it('should remove spoiler class when isSpoilerHidden is false', async () => {
    setAuthorization(true);

    const node = document.createElement('div');
    const { spoiler } = await renderStore(() =>
      useSpoilerAction({
        type: 'movie',
        media: { id: 1337 },
      })
    );

    node.classList.add(SPOILER_CLASS_NAME);
    spoiler(node);

    expect(node.classList.contains(SPOILER_CLASS_NAME)).toBe(false);
  });

  it('should remove the spoiler class when a movie is watched', async () => {
    setAuthorization(true);

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

    const node = document.createElement('div');
    const { spoiler } = await renderStore(() =>
      useSpoilerAction({
        type: 'movie',
        media: {
          id: Number(
            assertDefined(Object.keys(WatchedMoviesResponseMock).at(0)),
          ),
        },
      })
    );

    // Attach the spoiler action
    spoiler(node);

    // Add the class to the node
    node.classList.add(SPOILER_CLASS_NAME);

    // Then verify it is removed
    await waitFor(
      () => expect(node.classList.contains(SPOILER_CLASS_NAME)).toBe(false),
    );
  });
});

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
import { BehaviorSubject } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { useMediaSpoiler } from '../useMediaSpoiler.ts';
import { spoiler } from './spoiler.ts';

describe('action: spoiler', () => {
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
    const { isSpoilerHidden } = await renderStore(() =>
      useMediaSpoiler({
        type: 'show',
        media: { id: 1337 },
      })
    );

    spoiler(node, isSpoilerHidden);

    await waitFor(() =>
      expect(node.classList.contains(SPOILER_CLASS_NAME)).toBe(true)
    );
  });

  it('should remove spoiler class when isSpoilerHidden is false', async () => {
    setAuthorization(true);

    const node = document.createElement('div');
    const { isSpoilerHidden } = await renderStore(() =>
      useMediaSpoiler({
        type: 'movie',
        media: { id: 1337 },
      })
    );

    node.classList.add(SPOILER_CLASS_NAME);
    spoiler(node, isSpoilerHidden);

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
    const { isSpoilerHidden } = await renderStore(() =>
      useMediaSpoiler({
        type: 'movie',
        media: {
          id: Number(
            assertDefined(Object.keys(WatchedMoviesResponseMock).at(0)),
          ),
        },
      })
    );

    spoiler(node, isSpoilerHidden);

    node.classList.add(SPOILER_CLASS_NAME);

    await waitFor(
      () => expect(node.classList.contains(SPOILER_CLASS_NAME)).toBe(false),
    );
  });

  it('should follow the new source when the media changes', () => {
    const node = document.createElement('div');
    const previous = new BehaviorSubject(false);
    const next = new BehaviorSubject(true);

    const action = spoiler(node, previous);
    expect(node.classList.contains(SPOILER_CLASS_NAME)).toBe(false);

    action.update(next);
    expect(node.classList.contains(SPOILER_CLASS_NAME)).toBe(true);

    next.next(false);
    expect(node.classList.contains(SPOILER_CLASS_NAME)).toBe(false);

    action.destroy();
  });

  it('should stop following the previous source after an update', () => {
    const node = document.createElement('div');
    const previous = new BehaviorSubject(false);
    const next = new BehaviorSubject(false);

    const action = spoiler(node, previous);
    action.update(next);

    previous.next(true);

    expect(node.classList.contains(SPOILER_CLASS_NAME)).toBe(false);

    action.destroy();
  });
});

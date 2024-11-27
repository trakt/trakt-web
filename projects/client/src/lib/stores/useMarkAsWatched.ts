import type { WatchAction } from '$lib/api.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import * as m from '$lib/features/i18n/messages.ts';
import type { MediaType } from '$lib/models/MediaType.ts';
import { markAsWatchedRequest } from '$lib/requests/sync/markAsWatchedRequest.ts';
import { SvelteMap } from 'svelte/reactivity';
import { toMarkAsWatchedPayload } from './_internal/toMarkAsWatchedPayload.ts';

export function resolveWatchDate(
  action: WatchAction | undefined,
) {
  const now = new Date().toISOString();

  switch (action) {
    case 'released':
      return 'released';
    case 'ask':
      return prompt(
        m.mark_as_watched_ask_prompt(),
        now,
      ) ?? undefined;
    case 'now':
    default:
      return now;
  }
}

type MarkAsWatchedStoreProps = {
  type: MediaType;
};

const markAsWatchedKey = (id: number) => `markAsWatched_${id}`;

export function useMarkAsWatched({ type }: MarkAsWatchedStoreProps) {
  const episodeLoadingMap = new SvelteMap<number, boolean>();

  const isLoading = (id: number) => episodeLoadingMap.get(id) ?? false;
  const watchedMap = new SvelteMap<number, boolean>();

  const isWatched = (id: number) => {
    return watchedMap.get(id) ??
      // FIXME: populate using user data
      localStorage.getItem(markAsWatchedKey(id)) === 'true';
  };

  const { current: user } = useUser();

  const markAsWatched = async (ids: number[] | number) => {
    ids = Array.isArray(ids) ? ids : [ids];

    const watchedAtDate = resolveWatchDate(
      user().preferences.watch.action,
    );

    ids.forEach((id) => episodeLoadingMap.set(id, true));

    const result = await markAsWatchedRequest({
      body: toMarkAsWatchedPayload(type, {
        ids,
        watchedAtDate,
      }),
    });

    ids.forEach((id) => episodeLoadingMap.set(id, false));
    ids.forEach((id) => {
      watchedMap.set(id, result);
      // FIXME: populate using user data
      localStorage.setItem(markAsWatchedKey(id), result.toString());
    });
  };

  return {
    markAsWatched,
    isWatched,
    isLoading,
  };
}

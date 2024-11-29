import type { WatchAction } from '$lib/api.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import * as m from '$lib/features/i18n/messages.ts';
import type { MediaType } from '$lib/models/MediaType.ts';
import { markAsWatchedRequest } from '$lib/requests/sync/markAsWatchedRequest.ts';
import { derived, writable } from 'svelte/store';
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
  id: number;
};

const markAsWatchedKey = (id: number) => `markAsWatched_${id}`;

export function useMarkAsWatched({ type, id }: MarkAsWatchedStoreProps) {
  const isMarkingAsWatched = writable(false);
  const { history } = useUser();

  const _isWatched = writable(
    localStorage.getItem(markAsWatchedKey(id)) == 'true',
  );

  const isWatched = derived(
    [history, _isWatched],
    ([$history, $memory]) => {
      if (!$history) {
        return $memory;
      }

      switch (type) {
        case 'movie':
          return $history.movies.has(id) || $memory;
        case 'episode':
          return false;
        case 'show':
          throw new Error('Not implemented');
      }
    },
  );

  const { current: user } = useUser();

  const markAsWatched = async () => {
    const watchedAtDate = resolveWatchDate(
      user().preferences.watch.action,
    );

    isMarkingAsWatched.set(true);
    const result = await markAsWatchedRequest({
      body: toMarkAsWatchedPayload(type, {
        ids: [id],
        watchedAtDate,
      }),
    });
    isMarkingAsWatched.set(false);

    _isWatched.set(result);
  };

  isWatched.subscribe((value) =>
    localStorage
      .setItem(markAsWatchedKey(id), value.toString())
  );

  return {
    markAsWatched,
    isWatched,
    isMarkingAsWatched,
  };
}

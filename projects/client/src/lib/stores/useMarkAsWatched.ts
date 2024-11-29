import type { WatchAction } from '$lib/api.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import * as m from '$lib/features/i18n/messages.ts';
import type { MediaType } from '$lib/models/MediaType.ts';
import { markAsWatchedRequest } from '$lib/requests/sync/markAsWatchedRequest.ts';
import { writable } from 'svelte/store';
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
  id: number | Nil;
};

const markAsWatchedKey = (id: number) => `markAsWatched_${id}`;

export function useMarkAsWatched({ type, id }: MarkAsWatchedStoreProps) {
  const isMarkingAsWatched = writable(false);
  console.log('id', id);
  const isWatched = writable(
    id != null &&
      localStorage.getItem(markAsWatchedKey(id)) == 'true',
  );

  const { current: user } = useUser();

  const markAsWatched = async (id: number) => {
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

    isWatched.set(result);
    localStorage.setItem(markAsWatchedKey(id), result.toString());
  };

  return {
    markAsWatched,
    isWatched,
    isMarkingAsWatched,
  };
}

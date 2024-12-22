import type { WatchAction } from '$lib/api.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import * as m from '$lib/features/i18n/messages.ts';
import type { MediaType } from '$lib/models/MediaType.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { markAsWatchedRequest } from '$lib/requests/sync/markAsWatchedRequest.ts';
import { derived, writable } from 'svelte/store';
import { toMarkAsWatchedPayload } from './_internal/toMarkAsWatchedPayload.ts';
import { useInvalidator } from './useInvalidator.ts';

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

export function useMarkAsWatched({ type, id }: MarkAsWatchedStoreProps) {
  const isMarkingAsWatched = writable(false);
  const { history } = useUser();
  const { invalidate } = useInvalidator();

  const _isWatched = writable(false);
  const isWatched = derived(
    [history, _isWatched],
    ([$history, $_isWatched]) => {
      if (!$history) {
        return false;
      }

      switch (type) {
        case 'movie':
          return $history.movies.has(id) || $_isWatched;
        case 'episode':
          return false;
        case 'show': {
          return !!$history.shows.get(id)?.isWatched || $_isWatched;
        }
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
    await invalidate(InvalidateAction.MarkAsWatched(type));
  };

  return {
    markAsWatched,
    isWatched,
    isMarkingAsWatched,
  };
}

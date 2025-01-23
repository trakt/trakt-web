import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { markAsWatchedRequest } from '$lib/requests/sync/markAsWatchedRequest.ts';
import { removeWatchedRequest } from '$lib/requests/sync/removeWatchedRequest.ts';
import { resolveWatchDate } from '$lib/stores/_internal/resolveWatchDate.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { resolve } from '$lib/utils/store/resolve.ts';
import { writable } from 'svelte/store';
import { toMarkAsWatchedPayload } from './toMarkAsWatchedPayload.ts';
import { useIsWatched } from './useIsWatched.ts';

type ArrayOrSingle<T> = T | T[];

type MarkAsWatchedEpisodeProps = {
  type: 'episode';
  media: ArrayOrSingle<{ id: number }>;
  show: { id: number };
  episode: ArrayOrSingle<{
    season: number;
    number: number;
  }>;
};

type MarkAsWatchedMediaProps = {
  type: 'movie' | 'show';
  media: ArrayOrSingle<{ id: number }>;
};

export type MarkAsWatchedStoreProps =
  | MarkAsWatchedEpisodeProps
  | MarkAsWatchedMediaProps;

export function useMarkAsWatched(
  props: MarkAsWatchedStoreProps,
) {
  const { type } = props;
  const media = Array.isArray(props.media) ? props.media : [props.media];
  const ids = media.map(({ id }) => id);
  const isMarkingAsWatched = writable(false);
  const { user } = useUser();
  const { invalidate } = useInvalidator();

  const { isWatched } = useIsWatched(props);

  const markAsWatched = async () => {
    const current = await resolve(user);

    if (!current) {
      return;
    }

    const watchedAtDate = resolveWatchDate(
      current.preferences.watch.action,
    );

    if (!watchedAtDate) {
      return;
    }

    isMarkingAsWatched.set(true);

    await markAsWatchedRequest({
      body: toMarkAsWatchedPayload(type, {
        ids,
        watchedAtDate,
      }),
    });

    isMarkingAsWatched.set(false);

    await invalidate(InvalidateAction.MarkAsWatched(type));
  };

  const removeWatched = async () => {
    isMarkingAsWatched.set(true);
    await removeWatchedRequest({
      body: toMarkAsWatchedPayload(type, {
        ids,
      }),
    });
    isMarkingAsWatched.set(false);

    await invalidate(InvalidateAction.MarkAsWatched(type));
  };

  return {
    markAsWatched,
    removeWatched,
    isWatched,
    isMarkingAsWatched,
  };
}

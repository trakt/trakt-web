import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { MediaType } from '$lib/models/MediaType.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { markAsWatchedRequest } from '$lib/requests/sync/markAsWatchedRequest.ts';
import { removeWatchedRequest } from '$lib/requests/sync/removeWatchedRequest.ts';
import { resolve } from '$lib/utils/store/resolve.ts';
import { derived, writable } from 'svelte/store';
import { resolveWatchDate } from './_internal/resolveWatchDate.ts';
import { toMarkAsWatchedPayload } from './_internal/toMarkAsWatchedPayload.ts';
import { useInvalidator } from './useInvalidator.ts';

type ArrayOrSingle<T> = T | T[];

type BaseProps = {
  type: MediaType | 'episode';
  media: ArrayOrSingle<{ id: number }>;
};

type EpisodeProps = {
  type: 'episode';
  show: { id: number };
  episode: ArrayOrSingle<{
    season: number;
    number: number;
  }>;
};

type NonEpisodeProps = {
  type: 'movie' | 'show';
  media: ArrayOrSingle<{ id: number }>;
};

export type MarkAsWatchedStoreProps =
  & BaseProps
  & (EpisodeProps | NonEpisodeProps);

export function useMarkAsWatched(
  props: MarkAsWatchedStoreProps,
) {
  const { type } = props;
  const media = Array.isArray(props.media) ? props.media : [props.media];
  const ids = media.map(({ id }) => id);
  const isMarkingAsWatched = writable(false);
  const { user, history } = useUser();
  const { invalidate } = useInvalidator();

  /**
   *  TODO: implement some sort of in-memory cache for result of action response
   *  that will allow to show optimistic UI updates while history is being updated
   */
  const isWatched = derived(
    history,
    ($history) => {
      if (!$history) {
        return false;
      }

      switch (type) {
        case 'movie':
          return media.every((m) => $history.movies.has(m.id));
        case 'episode':
          const episodes = Array.isArray(props.episode)
            ? props.episode
            : [props.episode];

          const watchedEpisodes = $history.shows.get(props.show.id)?.episodes ??
            [];

          return episodes.every((episode) =>
            watchedEpisodes.some((e) =>
              e.season === episode.season && e.episode === episode.number
            )
          );
        case 'show': {
          return media.every((m) => !!$history.shows.get(m.id)?.isWatched);
        }
      }
    },
  );

  const markAsWatched = async () => {
    const current = await resolve(user);

    if (!current) {
      return;
    }

    const watchedAtDate = resolveWatchDate(
      current.preferences.watch.action,
    );

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

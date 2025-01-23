import { useUser } from '$lib/features/auth/stores/useUser';
import { derived } from 'svelte/store';
import type { MarkAsWatchedStoreProps } from './useMarkAsWatched';

export type IsWatchedProps = MarkAsWatchedStoreProps;
export function useIsWatched(props: IsWatchedProps) {
  const { type } = props;
  const media = Array.isArray(props.media) ? props.media : [props.media];
  const { history } = useUser();

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
        case 'episode': {
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
        }
        case 'show': {
          return media.every((m) =>
            Boolean($history.shows.get(m.id)?.isWatched)
          );
        }
      }
    },
  );

  return isWatched;
}

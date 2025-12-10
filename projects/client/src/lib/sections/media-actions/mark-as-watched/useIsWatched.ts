import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { toObservable } from '$lib/utils/store/toObservable.ts';
import { map } from 'rxjs';
import type { MediaStoreProps } from '../../../models/MediaStoreProps.ts';

export type IsWatchedProps = MediaStoreProps;

export function useIsWatched(props: IsWatchedProps) {
  const { type } = props;
  const media = Array.isArray(props.media) ? props.media : [props.media];
  const { history } = useUser();

  const episodes = props.type === 'episode'
    ? Array.isArray(props.media) ? props.media : [props.media]
    : [];
  const showId = props.type === 'episode' ? props.show.id : -1;

  const isWatched = toObservable(history).pipe(
    map((h) => {
      if (!h) {
        return false;
      }

      switch (type) {
        case 'movie':
          return media.every((m) => h.movies.has(m.id));
        case 'episode': {
          const watchedEpisodes = h.shows.get(showId)?.episodes ??
            [];

          return episodes.every((episode) =>
            watchedEpisodes.some((e) =>
              e.season === episode.season && e.episode === episode.number
            )
          );
        }
        case 'show': {
          return media.every((m) => Boolean(h.shows.get(m.id)?.isWatched));
        }
      }
    }),
  );

  return { isWatched };
}

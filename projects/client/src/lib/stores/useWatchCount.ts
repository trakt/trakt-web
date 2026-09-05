import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import { getShowWatchState } from '$lib/utils/media/getShowWatchState.ts';
import { combineLatest, map } from 'rxjs';

export type UseWatchCountProps =
  | { type: 'movie'; media: MediaEntry }
  // The episode count is optional so list cards, which carry a leaner entry,
  // can ask too. Without it a show cannot read as fully watched, and
  // `getShowWatchState` already returns no count in that case.
  | {
    type: 'show';
    media: MediaEntry & Partial<{ episode: { count: number } }>;
  }
  | { type: 'episode'; show: { id: number }; episode: EpisodeEntry };

export function useWatchCount(props: UseWatchCountProps) {
  const { history } = useUser();

  const mediaId = props.type !== 'episode' ? props.media.id : -1;
  const showId = props.type === 'episode' ? props.show.id : -1;
  const episodeId = props.type === 'episode' ? props.episode.id : -1;

  const watchCount = combineLatest([history]).pipe(
    map(([$history]) => {
      if (!$history) return 0;

      switch (props.type) {
        case 'movie':
          return $history.movies.get(mediaId)?.plays ?? 0;
        case 'show': {
          const { isWatched, minPlays } = getShowWatchState({
            watchedShow: $history.shows.get(mediaId),
            episodeCount: props.media.episode?.count,
          });

          return isWatched ? minPlays : 0;
        }
        case 'episode': {
          const show = $history.shows.get(showId);
          const historyEpisode = show?.episodes.find(
            (e) => e.episodeId === episodeId,
          );

          return historyEpisode?.plays ?? 0;
        }
      }
    }),
  );

  return { watchCount };
}

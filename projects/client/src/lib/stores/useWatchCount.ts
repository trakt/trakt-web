import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
import { combineLatest, map } from 'rxjs';

export type UseWatchCountProps =
  | { type: 'movie'; media: MediaEntry }
  | { type: 'show'; media: ShowEntry }
  | { type: 'episode'; show: ShowEntry; episode: EpisodeEntry };

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
          const watchedShow = $history.shows.get(mediaId);
          if (!watchedShow) return 0;

          const episodeCount = props.media.episode.count;
          const regularEpisodes = watchedShow.episodes.filter(
            (e) => e.season !== 0,
          );

          if (regularEpisodes.length < episodeCount) return 0;

          return Math.min(...regularEpisodes.map((e) => e.plays));
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

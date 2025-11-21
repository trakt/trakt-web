import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
import { derived } from 'svelte/store';

export type UseWatchCountProps = {
  type: MediaType;
  media: MediaEntry;
} | {
  type: 'episode';
  show: ShowEntry;
  episode: EpisodeEntry;
};

export function useWatchCount(props: UseWatchCountProps) {
  const { history } = useUser();

  const mediaId = props.type !== 'episode' ? props.media.id : -1;
  const showId = props.type === 'episode' ? props.show.id : -1;
  const episode = props.type === 'episode'
    ? {
      season: props.episode.season,
      number: props.episode.number,
    }
    : null;

  const watchCount = derived(
    history,
    ($history) => {
      if (!$history) {
        return 0;
      }

      switch (props.type) {
        case 'movie':
          return $history.movies.get(mediaId)?.plays ?? 0;
        case 'show': {
          return $history.shows.get(mediaId)?.plays ?? 0;
        }
        case 'episode': {
          const show = $history.shows.get(showId);
          const historyEpisode = show?.episodes.find(
            (e) =>
              e.season === episode?.season &&
              e.episode === episode?.number,
          );

          return historyEpisode?.plays ?? 0;
        }
      }
    },
  );

  return { watchCount };
}

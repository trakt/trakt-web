import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
import { derived } from 'svelte/store';

type UseWatchCountProps = {
  type: MediaType;
  media: MediaEntry;
} | {
  type: 'episode';
  show: ShowEntry;
  episode: EpisodeEntry;
};

export function useWatchCount(props: UseWatchCountProps) {
  const { history } = useUser();

  const watchCount = derived(
    history,
    ($history) => {
      if (!$history) {
        return 0;
      }

      switch (props.type) {
        case 'movie':
          return $history.movies.get(props.media.id)?.plays ?? 0;
        case 'show': {
          return $history.shows.get(props.media.id)?.plays ?? 0;
        }
        case 'episode': {
          const show = $history.shows.get(props.show.id);
          const episode = show?.episodes.find(
            (e) =>
              e.season === props.episode.season &&
              e.episode === props.episode.number,
          );

          return episode?.plays ?? 0;
        }
      }
    },
  );

  return { watchCount };
}

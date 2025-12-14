import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import { EpisodeComputedType } from '$lib/requests/models/EpisodeType.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
import { map } from 'rxjs';
import { useMediaSpoiler } from './useMediaSpoiler.ts';

type SpoilerImageProps = {
  episode: EpisodeEntry;
  show: ShowEntry;
};

export function useEpisodeSpoilerImage(props: SpoilerImageProps) {
  const { episode, show } = props;

  const { isSpoilerHidden } = useMediaSpoiler({
    show,
    media: episode,
    type: 'episode',
  });

  return isSpoilerHidden.pipe(
    map(($isSpoilerHidden) => {
      switch (episode.type) {
        case EpisodeComputedType.full_season:
        case EpisodeComputedType.multiple_episodes:
          return show.cover.url.thumb;
        default:
          return $isSpoilerHidden
            ? show.cover.url.thumb
            : episode.cover.url ?? show.cover.url.thumb;
      }
    }),
  );
}

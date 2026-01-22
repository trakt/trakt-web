import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import { EpisodeComputedType } from '$lib/requests/models/EpisodeType.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
import { map } from 'rxjs';
import type { EpisodeCardProps } from '../../sections/lists/components/models/EpisodeCardProps.ts';
import { useMediaSpoiler } from './useMediaSpoiler.ts';

type SpoilerImageProps = {
  episode: EpisodeEntry;
  show: ShowEntry;
} & Pick<EpisodeCardProps, 'variant'>;

const SHOW_COVER_VARIANTS: readonly EpisodeCardProps['variant'][] = [
  'next',
  'upcoming',
] as const;

export function useEpisodeSpoilerImage(props: SpoilerImageProps) {
  const { episode, show, variant } = props;

  const { isSpoilerHidden } = useMediaSpoiler({
    show,
    media: episode,
    type: 'episode',
  });

  return isSpoilerHidden.pipe(
    map(($isSpoilerHidden) => {
      if (SHOW_COVER_VARIANTS.includes(variant)) {
        return show.cover.url.thumb;
      }

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

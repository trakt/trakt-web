import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import { episodeSubtitle } from '$lib/utils/intl/episodeSubtitle.ts';
import { map } from 'rxjs';
import { useMediaSpoiler } from './useMediaSpoiler.ts';

type SpoilerFreeEpisodeTitleProps = {
  episode: EpisodeEntry;
  show: { id: number; title: string };
};

export function useSpoilerFreeEpisodeTitle(
  props: SpoilerFreeEpisodeTitleProps,
) {
  const { episode, show } = props;

  const { isSpoilerHidden } = useMediaSpoiler({
    show,
    media: episode,
    type: 'episode',
  });

  return isSpoilerHidden.pipe(
    map(($isSpoilerHidden) =>
      $isSpoilerHidden ? episodeSubtitle(episode) : episode.title
    ),
  );
}

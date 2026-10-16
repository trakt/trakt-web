import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import { episodeSubtitle } from '$lib/utils/intl/episodeSubtitle.ts';
import { map, type Observable } from 'rxjs';
import { useMediaSpoiler } from './useMediaSpoiler.ts';

type SpoilerFreeEpisodeTitleProps = {
  episode: EpisodeEntry;
  show: { id: number; title: string };
  isSpoilerHidden?: Observable<boolean>;
};

export function useSpoilerFreeEpisodeTitle(
  props: SpoilerFreeEpisodeTitleProps,
) {
  const { episode, show } = props;

  const isSpoilerHidden = props.isSpoilerHidden ?? useMediaSpoiler({
    show,
    media: episode,
    type: 'episode',
  }).isSpoilerHidden;

  return isSpoilerHidden.pipe(
    map(($isSpoilerHidden) =>
      $isSpoilerHidden ? episodeSubtitle(episode) : episode.title
    ),
  );
}

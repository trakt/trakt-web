import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
import { derived } from 'svelte/store';
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

  return derived(
    isSpoilerHidden,
    ($isSpoilerHidden) =>
      $isSpoilerHidden
        ? show.cover.url.thumb
        : episode.cover.url ?? show.cover.url.thumb,
  );
}

import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry';
import type { ShowEntry as MediaEntry } from '$lib/requests/models/ShowEntry';
import { derived } from 'svelte/store';
import { useSpoiler } from './_internal/useSpoiler';

type SpoilerImageProps = {
  episode: EpisodeEntry;
  show: MediaEntry;
};

export function useEpisodeSpoilerImage(props: SpoilerImageProps) {
  const { isSpoilerHidden } = useSpoiler();

  const { episode, show } = props;

  return derived(
    isSpoilerHidden,
    ($isSpoilerHidden) =>
      $isSpoilerHidden
        ? show.cover.url.thumb
        : episode.cover.url ?? show.cover.url.thumb,
  );
}

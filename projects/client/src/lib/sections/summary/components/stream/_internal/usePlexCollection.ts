import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { derived, readable } from 'svelte/store';
import type { MetaInfoProps } from '../../media/useMediaMetaInfo.ts';

export function usePlexCollection(target: MetaInfoProps) {
  if (!target.media.plexSlug) {
    return {
      isInCollection: readable(false),
    };
  }

  const { plexCollection } = useUser();

  const isInCollection = derived(
    plexCollection,
    ($plexCollection) => {
      switch (target.type) {
        case 'movie':
          return $plexCollection?.movieIds.includes(target.media.id);
        case 'show':
          return $plexCollection?.showIds.includes(target.media.id);
        case 'episode':
          return $plexCollection?.episodeIds.includes(target.episode.id);
      }
    },
  );

  return {
    isInCollection: derived(
      isInCollection,
      ($isInCollection) => $isInCollection,
    ),
  };
}

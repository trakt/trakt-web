import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { derived, readable } from 'svelte/store';
import type { MetaInfoProps } from '../../media/useMediaMetaInfo.ts';

export function usePlexLibrary(target: MetaInfoProps) {
  if (!target.media.plexSlug) {
    return {
      isInLibrary: readable(false),
    };
  }

  const { plexLibrary } = useUser();

  const isInLibrary = derived(
    plexLibrary,
    ($plexLibrary) => {
      switch (target.type) {
        case 'movie':
          return $plexLibrary?.movieIds.includes(target.media.id);
        case 'show':
          return $plexLibrary?.showIds.includes(target.media.id);
        case 'episode':
          return $plexLibrary?.episodeIds.includes(target.episode.id);
      }
    },
  );

  return {
    isInLibrary: derived(
      isInLibrary,
      ($isInLibrary) => $isInLibrary,
    ),
  };
}

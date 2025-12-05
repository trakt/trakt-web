import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { derived, readable } from 'svelte/store';
import type { LibraryOption } from '../../sections/lists/where-to-watch/models/LibraryOption.ts';
import type { MetaInfoProps } from '../../sections/summary/components/media/useMediaMetaInfo.ts';
import { buildPlexLink } from './buildPlexLink.ts';

export function usePlexLibrary(target: MetaInfoProps) {
  if (!target.media.plexSlug) {
    return {
      plexServices: readable([]),
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
    plexServices: derived(
      isInLibrary,
      ($isInLibrary) => {
        if ($isInLibrary) {
          const plexService: LibraryOption = {
            key: 'library-plex',
            type: 'library',
            source: 'plex',
            link: buildPlexLink(target),
          };

          return [plexService];
        }

        return [] as LibraryOption[];
      },
    ),
  };
}

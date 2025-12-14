import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { map, of } from 'rxjs';
import type { LibraryOption } from '../../sections/lists/where-to-watch/models/LibraryOption.ts';
import type { MetaInfoProps } from '../../sections/summary/components/media/useMediaMetaInfo.ts';
import { buildPlexLink } from './buildPlexLink.ts';

export function usePlexLibrary(target: MetaInfoProps) {
  if (!target.media.plexSlug) {
    return {
      plexServices: of([]),
    };
  }

  const { plexLibrary } = useUser();

  const isInLibrary = plexLibrary.pipe(
    map(($plexLibrary) => {
      switch (target.type) {
        case 'movie':
          return $plexLibrary?.movieIds.includes(target.media.id);
        case 'show':
          return $plexLibrary?.showIds.includes(target.media.id);
        case 'episode':
          return $plexLibrary?.episodeIds.includes(target.episode.id);
      }
    }),
  );

  return {
    plexServices: isInLibrary.pipe(
      map(($isInLibrary) => {
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
      }),
    ),
  };
}

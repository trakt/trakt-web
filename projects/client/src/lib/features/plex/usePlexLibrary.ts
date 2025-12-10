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
    map((lib) => {
      switch (target.type) {
        case 'movie':
          return lib?.movieIds.includes(target.media.id);
        case 'show':
          return lib?.showIds.includes(target.media.id);
        case 'episode':
          return lib?.episodeIds.includes(target.episode.id);
      }
    }),
  );

  return {
    plexServices: isInLibrary.pipe(
      map((inLib) => {
        if (inLib) {
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

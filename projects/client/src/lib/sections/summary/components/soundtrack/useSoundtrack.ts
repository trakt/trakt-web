import { getLocale } from '$lib/features/i18n/index.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { movieSoundtrackQuery } from '$lib/requests/queries/movies/movieSoundtrackQuery.ts';
import { showSoundtrackQuery } from '$lib/requests/queries/shows/showSoundtrackQuery.ts';
import { distinctUntilChanged, map, type Observable } from 'rxjs';

export type SoundtrackTarget = {
  slug: string;
  type: MediaType;
};

function toQuery({ slug, type }: SoundtrackTarget) {
  const params = { slug, locale: getLocale() };

  switch (type) {
    case 'show':
      return showSoundtrackQuery(params);
    default:
      return movieSoundtrackQuery(params);
  }
}

export function useSoundtrack(target$: Observable<SoundtrackTarget>) {
  const query = useQuery(
    target$.pipe(
      distinctUntilChanged(
        (previous, next) =>
          previous.slug === next.slug && previous.type === next.type,
      ),
      map(toQuery),
    ),
  );

  return {
    tracks: query.pipe(map(($query) => $query.data ?? [])),
    isLoading: query.pipe(map(($query) => $query.isPending)),
  };
}

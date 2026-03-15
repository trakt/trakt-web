import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import { map } from 'rxjs';

export function useIsDropped(media: MediaEntry) {
  const { dropped } = useUser();

  const isDropped = dropped.pipe(
    map(($dropped) => {
      if (!$dropped) {
        return false;
      }

      return $dropped.shows.has(media.id);
    }),
  );

  return {
    isDropped,
  };
}

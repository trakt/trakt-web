import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import { map } from 'rxjs';
import { isMediaDropped } from './_internal/isMediaDropped.ts';

export function useIsDropped(media: MediaEntry) {
  const { dropped } = useUser();

  const isDropped = dropped.pipe(
    map(($dropped) => isMediaDropped(media, $dropped)),
  );

  return {
    isDropped,
  };
}

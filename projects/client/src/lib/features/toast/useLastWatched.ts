import { get } from 'svelte/store';
import type { MediaType } from '../../requests/models/MediaType.ts';
import { getToastContext } from './_internal/getToastContext.ts';
import { useDismissals } from './useDismissals.ts';

export function useLastWatched() {
  const { lastWatched } = getToastContext();
  const { dismiss } = useDismissals();

  return {
    lastWatched,
    dismiss: (id: number, type: MediaType | 'episode') => {
      const item = get(lastWatched);
      if (id !== item?.media.id || type !== item?.type) {
        return;
      }

      dismiss(id, type);
    },
  };
}

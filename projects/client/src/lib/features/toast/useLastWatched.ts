import type { ExtendedMediaType } from '$lib/requests/models/ExtendedMediaType.ts';
import { getToastContext } from './_internal/getToastContext.ts';
import { useDismissals } from './useDismissals.ts';

export function useLastWatched() {
  const { lastWatched } = getToastContext();
  const { dismiss } = useDismissals();

  return {
    lastWatched,
    dismiss: (id: number, type: ExtendedMediaType) => {
      const item = lastWatched.value;
      if (id !== item?.media.id || type !== item?.type) {
        return;
      }

      dismiss(id, type);
    },
  };
}

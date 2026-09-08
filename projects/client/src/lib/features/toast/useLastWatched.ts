import type { ExtendedMediaType } from '$lib/requests/models/ExtendedMediaType.ts';
import { getToastContext } from './_internal/getToastContext.ts';
import type { DismissalVariant } from './models/DismissalVariant.ts';
import { useDismissals } from './useDismissals.ts';

export function useLastWatched() {
  const { lastWatched } = getToastContext();
  const { dismiss } = useDismissals();

  return {
    lastWatched,
    dismiss: (
      id: number,
      type: ExtendedMediaType,
      variant: DismissalVariant,
    ) => {
      const item = lastWatched.value;
      if (id !== item?.media.id || type !== item?.type) {
        return;
      }

      if (variant === 'manual') {
        lastWatched.next(null);
      }

      dismiss(id, type);
    },
  };
}

import type { ExtendedMediaType } from '$lib/requests/models/ExtendedMediaType.ts';
import { getToastContext } from './_internal/getToastContext.ts';
import type { DismissalVariant } from './models/DismissalVariant.ts';
import { useDismissals } from './useDismissals.ts';

export function useLastWatched() {
  const { lastWatched } = getToastContext();
  const { dismiss, isSuppressed, suppress, isAtLimit } = useDismissals();

  return {
    lastWatched,
    isSuppressed,
    suppress,
    isAtLimit,
    dismiss: (
      id: number,
      type: ExtendedMediaType,
      variant: DismissalVariant,
    ) => {
      const item = lastWatched.value;
      if (id !== item?.media.id || type !== item?.type) {
        return;
      }

      dismiss(id, type, variant);
    },
  };
}

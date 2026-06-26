import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { ExtendedMediaType } from '$lib/requests/models/ExtendedMediaType.ts';
import { saveSettingsRequest } from '$lib/requests/queries/users/saveSettingsRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { getToastContext } from './_internal/getToastContext.ts';
import type { DismissalVariant } from './models/DismissalVariant.ts';
import { useDismissals } from './useDismissals.ts';

export function useLastWatched() {
  const { lastWatched } = getToastContext();
  const { dismiss, isAtLimit, resetCount } = useDismissals();
  const { invalidate } = useInvalidator();

  return {
    lastWatched,
    isAtLimit,
    suppress: async () => {
      const success = await saveSettingsRequest({
        body: { browsing: { show_rating_prompt: false } },
      });

      if (!success) {
        return;
      }

      resetCount();
      lastWatched.next(null);
      await invalidate(InvalidateAction.User.Settings);
    },
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

      dismiss(id, type, variant);
    },
  };
}

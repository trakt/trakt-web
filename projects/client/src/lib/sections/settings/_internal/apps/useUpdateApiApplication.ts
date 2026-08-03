import * as m from '$lib/features/i18n/messages.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { updateApiApplicationRequest } from '$lib/requests/queries/apps/updateApiApplicationRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { BehaviorSubject } from 'rxjs';
import type { ApiApplicationFormValues } from './ApiApplicationFormValues.ts';

type UpdateApiApplicationInput = {
  id: number;
} & ApiApplicationFormValues;

type UpdateApiApplicationError = {
  id: number;
  message: string;
};

export function useUpdateApiApplication() {
  const isUpdating = new BehaviorSubject(false);
  const error = new BehaviorSubject<UpdateApiApplicationError | null>(null);
  const { invalidate } = useInvalidator();

  const updateApplication = async (
    input: UpdateApiApplicationInput,
  ): Promise<boolean> => {
    isUpdating.next(true);
    error.next(null);

    try {
      const result = await updateApiApplicationRequest(input);

      if (!result.ok) {
        error.next({ id: input.id, message: m.error_text_app_save_failed() });
        return false;
      }

      await invalidate(InvalidateAction.App.Update);
      return true;
    } catch {
      error.next({ id: input.id, message: m.error_text_app_save_failed() });
      return false;
    } finally {
      isUpdating.next(false);
    }
  };

  return {
    isUpdating: isUpdating.asObservable(),
    error: error.asObservable(),
    dismissError: () => error.next(null),
    updateApplication,
  };
}

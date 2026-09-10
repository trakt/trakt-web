import * as m from '$lib/features/i18n/messages.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { updateApiApplicationRequest } from '$lib/requests/queries/apps/updateApiApplicationRequest.ts';
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
  const error = new BehaviorSubject<UpdateApiApplicationError | null>(null);

  const update = useMutation(defineMutation({
    key: 'app:update',
    request: (input: UpdateApiApplicationInput) =>
      updateApiApplicationRequest(input),
    invalidations: ({ data }) => data.ok ? [InvalidateAction.App.Update] : [],
  }));

  const updateApplication = async (
    input: UpdateApiApplicationInput,
  ): Promise<boolean> => {
    error.next(null);

    try {
      const result = await update.mutate(input);

      if (!result.ok) {
        error.next({ id: input.id, message: m.error_text_app_save_failed() });
        return false;
      }

      return true;
    } catch {
      error.next({ id: input.id, message: m.error_text_app_save_failed() });
      return false;
    }
  };

  return {
    isUpdating: update.isPending,
    error: error.asObservable(),
    dismissError: () => error.next(null),
    updateApplication,
  };
}

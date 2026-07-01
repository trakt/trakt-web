import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { updateApiApplicationRequest } from '$lib/requests/queries/apps/updateApiApplicationRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { BehaviorSubject } from 'rxjs';
import type { ApiApplicationFormValues } from './ApiApplicationFormValues.ts';

type UpdateApiApplicationInput = {
  id: number;
} & ApiApplicationFormValues;

export function useUpdateApiApplication() {
  const isUpdating = new BehaviorSubject(false);
  const { invalidate } = useInvalidator();

  const updateApplication = async (
    input: UpdateApiApplicationInput,
  ): Promise<boolean> => {
    isUpdating.next(true);

    try {
      const updated = await updateApiApplicationRequest(input);

      if (updated) {
        await invalidate(InvalidateAction.App.Update);
      }

      return updated;
    } finally {
      isUpdating.next(false);
    }
  };

  return {
    isUpdating: isUpdating.asObservable(),
    updateApplication,
  };
}

import * as m from '$lib/features/i18n/messages.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import {
  createApiApplicationRequest,
  type CreateApiApplicationResult,
} from '$lib/requests/queries/apps/createApiApplicationRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { BehaviorSubject } from 'rxjs';
import type { ApiApplicationFormValues } from './ApiApplicationFormValues.ts';

export function useCreateApiApplication() {
  const isCreating = new BehaviorSubject(false);
  const error = new BehaviorSubject<string | null>(null);
  const { invalidate } = useInvalidator();

  const createApplication = async (
    input: ApiApplicationFormValues,
  ): Promise<CreateApiApplicationResult> => {
    isCreating.next(true);
    error.next(null);

    try {
      const result = await createApiApplicationRequest(input);

      if (!result.ok) {
        error.next(m.error_text_app_save_failed());
        return result;
      }

      await invalidate(InvalidateAction.App.Create);
      return result;
    } catch {
      error.next(m.error_text_app_save_failed());
      return { ok: false };
    } finally {
      isCreating.next(false);
    }
  };

  return {
    isCreating: isCreating.asObservable(),
    error: error.asObservable(),
    dismissError: () => error.next(null),
    createApplication,
  };
}

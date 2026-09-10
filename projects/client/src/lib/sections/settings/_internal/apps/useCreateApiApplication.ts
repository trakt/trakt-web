import * as m from '$lib/features/i18n/messages.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import {
  createApiApplicationRequest,
  type CreateApiApplicationResult,
} from '$lib/requests/queries/apps/createApiApplicationRequest.ts';
import { BehaviorSubject } from 'rxjs';
import type { ApiApplicationFormValues } from './ApiApplicationFormValues.ts';

export function useCreateApiApplication() {
  const error = new BehaviorSubject<string | null>(null);

  const creation = useMutation(defineMutation({
    key: 'app:create',
    request: (input: ApiApplicationFormValues) =>
      createApiApplicationRequest(input),
    invalidations: ({ data }) => data.ok ? [InvalidateAction.App.Create] : [],
  }));

  const createApplication = async (
    input: ApiApplicationFormValues,
  ): Promise<CreateApiApplicationResult> => {
    error.next(null);

    try {
      const result = await creation.mutate(input);

      if (!result.ok) {
        error.next(m.error_text_app_save_failed());
      }

      return result;
    } catch {
      error.next(m.error_text_app_save_failed());
      return { ok: false };
    }
  };

  return {
    isCreating: creation.isPending,
    error: error.asObservable(),
    dismissError: () => error.next(null),
    createApplication,
  };
}

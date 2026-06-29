import type { ApiApplication } from '$lib/requests/models/ApiApplication.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { createApiApplicationRequest } from '$lib/requests/queries/apps/createApiApplicationRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { BehaviorSubject } from 'rxjs';

type CreateApiApplicationInput = {
  name: string;
  description?: string;
  redirectUris: ReadonlyArray<string>;
  origins: ReadonlyArray<string>;
};

export function useCreateApiApplication() {
  const isCreating = new BehaviorSubject(false);
  const { invalidate } = useInvalidator();

  const createApplication = async (
    input: CreateApiApplicationInput,
  ): Promise<ApiApplication | null> => {
    isCreating.next(true);

    try {
      const created = await createApiApplicationRequest(input);

      if (created) {
        await invalidate(InvalidateAction.App.Create);
      }

      return created;
    } finally {
      isCreating.next(false);
    }
  };

  return {
    isCreating: isCreating.asObservable(),
    createApplication,
  };
}

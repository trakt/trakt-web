import { isValidResponse } from '$lib/features/query/_internal/isValidResponse.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';

type AddListCollaboratorParams = {
  listId: number;
  userSlug: string;
} & ApiParams;

export type AddListCollaboratorResult = 'added' | 'limit-reached' | 'failed';

export async function addListCollaboratorRequest(
  { fetch, listId, userSlug }: AddListCollaboratorParams,
): Promise<AddListCollaboratorResult> {
  const response = await rawApiFetch({
    fetch,
    path: `/lists/${listId}/collaborators/${userSlug}`,
    init: {
      method: 'POST',
    },
  });

  if (response.status === 420) {
    return 'limit-reached';
  }

  isValidResponse(response, 'addListCollaboratorRequest');
  return response.ok ? 'added' : 'failed';
}

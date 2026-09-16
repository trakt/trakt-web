import { isValidResponse } from '$lib/features/query/_internal/isValidResponse.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';

type AddListCollaboratorParams = {
  listId: number;
  userSlug: string;
} & ApiParams;

export async function addListCollaboratorRequest(
  { fetch, listId, userSlug }: AddListCollaboratorParams,
): Promise<boolean> {
  const response = await rawApiFetch({
    fetch,
    path: `/lists/${listId}/collaborators/${userSlug}`,
    init: {
      method: 'POST',
    },
  });

  if (!isValidResponse(response, 'addListCollaboratorRequest')) {
    return false;
  }

  return response.ok;
}

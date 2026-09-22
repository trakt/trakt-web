import { isValidResponse } from '$lib/features/query/_internal/isValidResponse.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';

type RemoveListCollaboratorParams = {
  listId: number;
  userSlug: string;
} & ApiParams;

export async function removeListCollaboratorRequest(
  { fetch, listId, userSlug }: RemoveListCollaboratorParams,
): Promise<boolean> {
  const response = await rawApiFetch({
    fetch,
    path: `/lists/${listId}/collaborators/${userSlug}`,
    init: {
      method: 'DELETE',
    },
  });

  isValidResponse(response, 'removeListCollaboratorRequest');
  return response.ok;
}

import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import type { NoteType } from '$lib/requests/models/NoteType.ts';
import { isValidResponse } from '../../../features/query/_internal/isValidResponse.ts';

type DeleteNoteParams = {
  id: number;
  body: {
    type: NoteType;
  };
} & ApiParams;

export async function deleteNoteRequest(
  { fetch, id, body }: DeleteNoteParams,
): Promise<boolean> {
  const response = await rawApiFetch({
    fetch,
    path: `/v3/users/me/notes/${id}`,
    init: {
      method: 'DELETE',
      body: JSON.stringify(body),
    },
  });

  if (!isValidResponse(response, 'deleteNoteRequest')) {
    return false;
  }

  return response.ok;
}

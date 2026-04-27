import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import type { NoteType } from '$lib/requests/models/NoteType.ts';
import { isValidResponse } from '../../../features/query/_internal/isValidResponse.ts';

type EditNoteParams = {
  id: number;
  body: {
    type: NoteType;
    notes: string;
  };
} & ApiParams;

export async function editNoteRequest(
  { fetch, id, body }: EditNoteParams,
): Promise<boolean> {
  const response = await rawApiFetch({
    fetch,
    path: `/v3/users/me/notes/${id}`,
    init: {
      method: 'PUT',
      body: JSON.stringify(body),
    },
  });

  if (!isValidResponse(response, 'editNoteRequest')) {
    return false;
  }

  return response.ok;
}

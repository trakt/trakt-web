import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { NoteType } from '$lib/requests/models/NoteType.ts';
import { isValidResponse } from '../../../features/query/_internal/isValidResponse.ts';

type PostNoteParams = {
  body: {
    media: { type: MediaType; id: string | number };
    type: NoteType;
    notes: string;
  };
} & ApiParams;

export async function postNoteRequest(
  { fetch, body }: PostNoteParams,
): Promise<boolean> {
  const response = await rawApiFetch({
    fetch,
    path: '/v3/users/me/notes',
    init: {
      method: 'POST',
      body: JSON.stringify(body),
    },
  });

  if (!isValidResponse(response, 'postNoteRequest')) {
    return false;
  }

  return response.ok;
}

import { api, type ApiParams } from '$lib/requests/api.ts';
import { z } from 'zod';
import type { ListPrivacy } from '../../models/ListPrivacy.ts';

const UpdatedListSchema = z.preprocess(
  (body) => Array.isArray(body) ? body.at(0) : body,
  z.object({
    ids: z.object({ slug: z.string() }),
  }),
);

type UpdateListRequest = {
  userId: string;
  listId: string;
  name: string;
  description?: string;
  privacy: ListPrivacy;
} & ApiParams;

export function updateListRequest(
  { userId, listId, name, fetch, description, privacy }: UpdateListRequest,
): Promise<string | Nil> {
  return api({ fetch })
    .users
    .lists
    .list
    .update({
      params: {
        id: userId,
        list_id: listId,
      },
      body: {
        name,
        description,
        privacy,
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        return undefined;
      }

      const parsed = UpdatedListSchema.safeParse(body);
      return parsed.success ? parsed.data.ids.slug : undefined;
    });
}

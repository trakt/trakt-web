import { api, type ApiParams } from '$lib/requests/api.ts';
import type { CreateListRequest } from '@trakt/api';
import { z } from 'zod';
import type { ListPrivacy } from '../../models/ListPrivacy.ts';

const CreatedListSchema = z.object({
  ids: z.object({
    trakt: z.number(),
    slug: z.string(),
  }),
});

type CreatedList = {
  id: number;
  slug: string;
};

type CreateListRequestParams =
  & {
    userId: string;
    description?: string;
    privacy: ListPrivacy;
  }
  & CreateListRequest
  & ApiParams;

export function createListRequest(
  { userId, name, fetch, description, privacy }: CreateListRequestParams,
): Promise<CreatedList | Nil> {
  return api({ fetch })
    .users
    .lists
    .create({
      params: {
        id: userId,
      },
      body: {
        name,
        description,
        privacy,
      },
    })
    .then(({ status, body }) => {
      if (status !== 201) {
        return undefined;
      }

      const parsed = CreatedListSchema.safeParse(body);

      if (!parsed.success) {
        return undefined;
      }

      return {
        id: parsed.data.ids.trakt,
        slug: parsed.data.ids.slug,
      };
    });
}

import type { GifEntry } from '$lib/requests/models/GifEntry.ts';
import { z } from 'zod';
import { KlipyGifResponseSchema } from './KlipyGifResponse.ts';
import { klipyProxyRequest } from './klipyProxyRequest.ts';
import { mapToGifEntry } from './mapToGifEntry.ts';

const KlipyGifsPageSchema = z.object({
  data: z.object({
    // Sponsored entries ride along in the same array, so items are validated
    // one by one below rather than as a whole.
    data: z.array(z.unknown()),
    has_next: z.boolean(),
  }),
});

export type KlipyGifsPage = {
  entries: GifEntry[];
  hasNext: boolean;
};

type KlipyGifsRequestParams = {
  path: 'gifs/trending' | 'gifs/search';
  page: number;
  limit: number;
  customerId: string;
  query?: string;
  fetch?: typeof fetch;
};

export async function klipyGifsRequest({
  path,
  page,
  limit,
  customerId,
  query,
  fetch,
}: KlipyGifsRequestParams): Promise<
  { status: 200; body: KlipyGifsPage | undefined }
> {
  const params = new URLSearchParams({
    customer_id: customerId,
    page: `${page}`,
    per_page: `${limit}`,
  });

  if (query) {
    params.set('q', query);
  }

  const { body } = await klipyProxyRequest({
    path,
    params,
    schema: KlipyGifsPageSchema,
    fetch,
  });

  if (body == null) {
    return { status: 200, body: undefined };
  }

  const { data: items, has_next: hasNext } = body.data;

  return {
    status: 200,
    body: {
      entries: items.flatMap((item) => {
        const gif = KlipyGifResponseSchema.safeParse(item);
        return gif.success ? [mapToGifEntry(gif.data)] : [];
      }),
      hasNext,
    },
  };
}

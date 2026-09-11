import type { GifEntry } from '$lib/requests/models/GifEntry.ts';
import type { Paginatable } from '$lib/requests/models/Paginatable.ts';
import type { KlipyGifsPage } from './klipyGifsRequest.ts';

type ToGifPageParams = {
  body: KlipyGifsPage | undefined;
  page: number;
};

// Klipy answers with `has_next` rather than a total, so the total is faked one
// page ahead while there is more to fetch - which is all `getNextPageParam`
// reads.
export function toGifPage(
  { body, page }: ToGifPageParams,
): Paginatable<GifEntry> {
  return {
    entries: body?.entries ?? [],
    page: {
      type: 'paginated',
      current: page,
      total: body?.hasNext ? page + 1 : page,
    },
  };
}

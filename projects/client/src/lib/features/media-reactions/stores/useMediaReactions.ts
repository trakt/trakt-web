import type { MediaReactionSummary } from '$lib/requests/models/MediaReactionSummary.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { mediaReactionsMock } from './_internal/mediaReactionsMock.ts';

type UseMediaReactionsProps = {
  type: MediaType;
  slug: string;
};

/**
 * How a title was reacted to, in aggregate.
 *
 * V0 is sourced from deterministic mock data so the team can play with a fully
 * functional prototype without a backend. When the endpoint ships, swap the
 * mock line for the real query - the return shape is unchanged:
 *
 *   const query = useQuery(mediaReactionsQuery({ type, slug }));
 *   return { summary: $derived(query.data ?? EMPTY_SUMMARY) };
 */
export function useMediaReactions(
  { type, slug }: UseMediaReactionsProps,
): { summary: MediaReactionSummary } {
  const summary = mediaReactionsMock.summary({
    mediaType: type,
    mediaId: slug,
  });

  return { summary };
}

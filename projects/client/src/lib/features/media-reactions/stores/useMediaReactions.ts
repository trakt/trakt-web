import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { ReactionSummary } from '$lib/requests/models/ReactionSummary.ts';
import { mediaReactionsMock } from './_internal/mediaReactionsMock.ts';

type UseMediaReactionsProps = {
  type: MediaType;
  slug: string;
};

/**
 * Aggregate reaction summary for a movie or show.
 *
 * V0 is sourced from deterministic mock data so the team can play with a fully
 * functional prototype without a backend. When the endpoint ships, swap the
 * mock line for the real query — the return shape is unchanged:
 *
 *   const query = useQuery(reactionSummaryQuery({ type, slug }));
 *   return { summary: $derived(query.data ?? EMPTY_SUMMARY) };
 */
export function useMediaReactions(
  { type, slug }: UseMediaReactionsProps,
): { summary: ReactionSummary } {
  const summary = mediaReactionsMock.summary({
    mediaType: type,
    mediaId: slug,
  });
  return { summary };
}

import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { ReactionForum } from '$lib/requests/models/ReactionForum.ts';
import type { ReactionSentiment } from '$lib/requests/models/ReactionSentiment.ts';
import { mediaReactionsMock } from './_internal/mediaReactionsMock.ts';

type UseReactionForumProps = {
  type: MediaType;
  slug: string;
  sentiment: ReactionSentiment;
};

/**
 * Public forum posts for a single sentiment on a movie or show.
 *
 * V0 sources deterministic mock data. When the endpoint ships, swap the mock
 * line for the real query — the return shape is unchanged:
 *
 *   const query = useQuery(reactionForumQuery({ type, slug, sentiment }));
 *   return { forum: $derived(query.data ?? { sentiment, posts: [] }) };
 */
export function useReactionForum(
  { type, slug, sentiment }: UseReactionForumProps,
): { forum: ReactionForum } {
  const forum = mediaReactionsMock.forum({
    mediaType: type,
    mediaId: slug,
    sentiment,
  });
  return { forum };
}

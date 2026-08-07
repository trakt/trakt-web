import type { ForumPost } from '$lib/requests/models/ForumPost.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { ReactionSentiment } from '$lib/requests/models/ReactionSentiment.ts';

export type ReactionEchoListProps = {
  type: MediaType;
  slug: string;
  sentiment: ReactionSentiment;
  // Your optimistic posts, prepended so they show instantly after posting.
  addedPosts: ForumPost[];
};

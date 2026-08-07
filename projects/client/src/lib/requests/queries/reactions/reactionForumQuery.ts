import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { ReactionAuthor } from '$lib/requests/models/ReactionAuthor.ts';
import type { ReactionForum } from '$lib/requests/models/ReactionForum.ts';
import { ReactionForumSchema } from '$lib/requests/models/ReactionForum.ts';
import type { ReactionSentiment } from '$lib/requests/models/ReactionSentiment.ts';
import { ReactionSentimentSchema } from '$lib/requests/models/ReactionSentiment.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';

const ReactionAuthorResponseSchema = z.object({
  username: z.string(),
  name: z.string().nullish(),
  avatar: z.string().nullish(),
  is_vip: z.boolean().nullish(),
});

const ForumReplyResponseSchema = z.object({
  id: z.string(),
  author: ReactionAuthorResponseSchema,
  body: z.string(),
  gif_url: z.string().nullish(),
  created_at: z.string(),
});

const ForumPostResponseSchema = z.object({
  id: z.string(),
  author: ReactionAuthorResponseSchema,
  body: z.string(),
  gif_url: z.string().nullish(),
  created_at: z.string(),
  like_count: z.number(),
  replies: z.array(ForumReplyResponseSchema),
});

const ReactionForumResponseSchema = z.object({
  sentiment: ReactionSentimentSchema,
  posts: z.array(ForumPostResponseSchema),
});

type ReactionForumResponse = z.infer<typeof ReactionForumResponseSchema>;
type ReactionAuthorResponse = z.infer<typeof ReactionAuthorResponseSchema>;

type ReactionForumParams =
  & {
    type: MediaType;
    slug: string;
    sentiment: ReactionSentiment;
  }
  & ApiParams;

const reactionForumRequest = async (
  { fetch, type, slug, sentiment }: ReactionForumParams,
) => {
  const response = await rawApiFetch({
    fetch,
    path: `/v3/reactions/${type}/${slug}/${sentiment}`,
  });

  return response.ok
    ? {
      body: ReactionForumResponseSchema.parse(await response.json()),
      status: 200,
    }
    : { body: undefined, status: 200 };
};

function mapToAuthor(response: ReactionAuthorResponse): ReactionAuthor {
  return {
    username: response.username,
    displayName: response.name ?? response.username,
    avatarUrl: response.avatar,
    isVip: response.is_vip ?? false,
  };
}

function mapToReactionForum(
  response: ReactionForumResponse | undefined,
  fallbackSentiment: ReactionSentiment,
): ReactionForum {
  if (response == null) {
    return { sentiment: fallbackSentiment, posts: [] };
  }

  return {
    sentiment: response.sentiment,
    posts: response.posts.map((post) => ({
      id: post.id,
      sentiment: response.sentiment,
      author: mapToAuthor(post.author),
      body: post.body,
      gifUrl: post.gif_url,
      createdAt: post.created_at,
      likeCount: post.like_count,
      replies: post.replies.map((reply) => ({
        id: reply.id,
        author: mapToAuthor(reply.author),
        body: reply.body,
        gifUrl: reply.gif_url,
        createdAt: reply.created_at,
      })),
    })),
  };
}

export const reactionForumQuery = defineQuery({
  key: 'reactionForum',
  invalidations: [],
  dependencies: (params) => [params.type, params.slug, params.sentiment],
  request: reactionForumRequest,
  mapper: (response, params) =>
    mapToReactionForum(response.body, params.sentiment),
  schema: ReactionForumSchema,
  enabled: (params) => Boolean(params.slug),
  ttl: time.minutes(5),
});

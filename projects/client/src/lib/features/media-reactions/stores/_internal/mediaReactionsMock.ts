import type { ForumPost } from '$lib/requests/models/ForumPost.ts';
import type { ForumReply } from '$lib/requests/models/ForumReply.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { ReactionAuthor } from '$lib/requests/models/ReactionAuthor.ts';
import type { ReactionForum } from '$lib/requests/models/ReactionForum.ts';
import type { ReactionSentiment } from '$lib/requests/models/ReactionSentiment.ts';
import { ReactionSentimentSchema } from '$lib/requests/models/ReactionSentiment.ts';
import type { ReactionSummary } from '$lib/requests/models/ReactionSummary.ts';
import { dummyReactionGifs } from '../../dummyReactionGifs.ts';

// Fixed base so generated timestamps stay deterministic across runs and tests.
const CREATED_BASE = Date.parse('2026-07-10T18:00:00.000Z');
const HOUR_MS = 60 * 60 * 1000;

const AUTHOR_POOL: ReadonlyArray<ReactionAuthor> = [
  { username: 'reel_tears', displayName: 'Priya', isVip: true },
  { username: 'couch_critic', displayName: 'Marcus', isVip: false },
  { username: 'no_spoilers_pls', displayName: 'Dana', isVip: false },
  { username: 'midnight_binge', displayName: 'Yuki', isVip: true },
  { username: 'popcorn_prophet', displayName: 'Sam', isVip: false },
  { username: 'plot_hole_patrol', displayName: 'Lena', isVip: false },
];

const BODY_POOL: ReadonlyArray<string> = [
  'I have not stopped thinking about that ending. Absolutely floored.',
  'Watched it twice back to back and it hit even harder the second time.',
  'The third act broke me in the best possible way.',
  'Okay but the pacing in the middle genuinely tested my patience.',
  'That reveal made my stomach drop — did NOT see it coming.',
  'Everyone said it was overrated. Everyone was wrong.',
  'I was sobbing by the end, no shame about it.',
  'Visually stunning, emotionally exhausting, ten out of ten.',
];

const REPLY_POOL: ReadonlyArray<string> = [
  'Right?? Glad I am not the only one.',
  'Hard disagree but I respect the passion.',
  'This is exactly how I felt walking out.',
  'Come to the forum more often, this take rules.',
];

const FALLBACK_AUTHOR: ReactionAuthor = {
  username: 'anonymous',
  displayName: 'Anonymous',
  isVip: false,
};

function seedFrom(value: string): number {
  return Array.from(value).reduce(
    (accumulator, character) =>
      (accumulator * 31 + character.charCodeAt(0)) >>> 0,
    7,
  );
}

function createSeededRandom(seed: number): () => number {
  let state = seed || 1;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

function pick<T>(pool: ReadonlyArray<T>, rng: () => number, fallback: T): T {
  const index = Math.floor(rng() * pool.length);
  return pool.at(index) ?? fallback;
}

function buildReplies(
  rng: () => number,
  postIndex: number,
): ForumReply[] {
  const replyCount = Math.floor(rng() * 3);
  return Array.from({ length: replyCount }, (_unused, replyIndex) => ({
    id: `reply-${postIndex}-${replyIndex}`,
    author: pick(AUTHOR_POOL, rng, FALLBACK_AUTHOR),
    body: pick(REPLY_POOL, rng, 'Nice take.'),
    createdAt: new Date(
      CREATED_BASE - (postIndex + replyIndex + 1) * HOUR_MS,
    ).toISOString(),
  }));
}

type SummaryParams = {
  mediaType: MediaType;
  mediaId: string;
};

type ForumParams = SummaryParams & {
  sentiment: ReactionSentiment;
};

export const mediaReactionsMock = {
  summary({ mediaType, mediaId }: SummaryParams): ReactionSummary {
    const rng = createSeededRandom(seedFrom(`${mediaType}:${mediaId}`));

    const metrics = ReactionSentimentSchema.options.map((sentiment) => ({
      sentiment,
      count: 4 + Math.floor(rng() * 320),
      hasReacted: false,
    }));

    const totalCount = metrics.reduce((sum, metric) => sum + metric.count, 0);

    return { totalCount, metrics };
  },

  forum({ mediaType, mediaId, sentiment }: ForumParams): ReactionForum {
    const rng = createSeededRandom(
      seedFrom(`${mediaType}:${mediaId}:${sentiment}`),
    );

    const postCount = 3 + Math.floor(rng() * 4);

    const posts: ForumPost[] = Array.from(
      { length: postCount },
      (_unused, postIndex) => ({
        id: `post-${sentiment}-${postIndex}`,
        sentiment,
        author: pick(AUTHOR_POOL, rng, FALLBACK_AUTHOR),
        body: pick(BODY_POOL, rng, 'No words.'),
        // Give roughly two of every three posts a self-contained dummy GIF,
        // cycling through the set so the forum shows visible variety.
        gifUrl: postIndex % 3 !== 2
          ? dummyReactionGifs.at(postIndex % dummyReactionGifs.length) ?? null
          : null,
        createdAt: new Date(CREATED_BASE - postIndex * HOUR_MS).toISOString(),
        likeCount: Math.floor(rng() * 90),
        replies: buildReplies(rng, postIndex),
      }),
    );

    return { sentiment, posts };
  },
};

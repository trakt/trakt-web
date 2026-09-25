import type { Reaction } from '$lib/requests/queries/comments/commentReactionsQuery.ts';

/**
 * Noto codepoint per reaction - see ReactionEmoji.
 *
 * One taxonomy, two surfaces: a review is reacted to with these, and so is a
 * title. They were separate vocabularies for a while and the titles' one was
 * richer, but two sets meant two things to translate, two to keep in emoji
 * order, and no way to read one against the other.
 *
 * Source: https://googlefonts.github.io/noto-emoji-animation/
 */
export const REACTIONS_CODE_MAP: Record<Reaction, string> = {
  like: '1f44d',
  dislike: '1f44e',
  love: '2764_fe0f',
  laugh: '1f602',
  shocked: '1f631',
  bravo: '1f44f',
  spoiler: '1fae3',
} as const;

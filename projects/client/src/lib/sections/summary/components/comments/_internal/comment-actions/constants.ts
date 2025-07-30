import type { Reaction } from '$lib/requests/queries/comments/commentReactionsQuery.ts';

export const REACTIONS_MAP: Record<Reaction, string> = {
  like: '👍',
  dislike: '👎',
  love: '❤️',
  laugh: '😂',
  shocked: '😱',
  bravo: '👏',
  spoiler: '🫣',
} as const;

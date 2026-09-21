import type { Reaction } from '$lib/requests/queries/comments/commentReactionsQuery.ts';

export const REACTIONS_CODE_MAP: Record<Reaction, string> = {
  like: '1f44d',
  dislike: '1f44e',
  love: '2764_fe0f',
  laugh: '1f602',
  shocked: '1f631',
  bravo: '1f44f',
  spoiler: '1fae3',
} as const;

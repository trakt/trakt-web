import type { CommentTypeProps } from '$lib/sections/summary/components/comments/CommentsProps.ts';

export type UseMyCommentsProps = {
  slug: string;
  enabled: boolean;
} & CommentTypeProps;

import { z } from 'zod';

export const CommentSortTypeSchema = z.enum(['likes', 'newest']);
export type CommentSortType = z.infer<typeof CommentSortTypeSchema>;

import { commentResponseSchema } from '@trakt/api';
import { z } from 'zod';

/*
  FIXME: drop once @trakt/api ships `gif` on the comment response.

  Zod strips what a schema does not declare, so parsing a comment against the
  contract's own schema silently drops the gif the api sends.
*/
export const CommentResponseWithGifSchema = commentResponseSchema.extend({
  gif: z.string().nullish(),
});

export type CommentResponseWithGif = z.infer<
  typeof CommentResponseWithGifSchema
>;

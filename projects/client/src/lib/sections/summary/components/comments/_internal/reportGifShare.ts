import { gifShareRequest } from '$lib/requests/queries/gifs/gifShareRequest.ts';
import type { CommentDraftGif } from './models/CommentDraftGif.ts';

type ReportGifShareParams = {
  gif: CommentDraftGif | Nil;
  customerId: string;
};

/**
 * Klipy ranks on usage, so a gif counts only once its comment is live. No slug
 * means it came off a stored comment and was counted when it was first picked.
 */
export function reportGifShare(
  { gif, customerId }: ReportGifShareParams,
): void {
  if (!gif?.slug) {
    return;
  }

  gifShareRequest({ slug: gif.slug, customerId });
}

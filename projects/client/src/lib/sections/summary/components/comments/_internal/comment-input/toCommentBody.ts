import type { CommentDraftGif } from '../models/CommentDraftGif.ts';

type ToCommentBodyProps = {
  text: string;
  gif: CommentDraftGif | Nil;
};

/**
 * Comments carry their gif as a plain link in the body - the server pulls it
 * out into the `gif` field on write. A gif on its own is a valid comment, so an
 * empty body is left empty rather than padded.
 */
export function toCommentBody({ text, gif }: ToCommentBodyProps): string {
  return [text.trim(), gif?.url]
    .filter(Boolean)
    .join('\n\n');
}

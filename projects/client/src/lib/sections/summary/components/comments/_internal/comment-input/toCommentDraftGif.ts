import type { GifEntry } from '$lib/requests/models/GifEntry.ts';
import type { CommentDraftGif } from '../models/CommentDraftGif.ts';

export function toCommentDraftGif(gif: GifEntry): CommentDraftGif {
  return {
    url: gif.url,
    previewUrl: gif.preview.url,
  };
}

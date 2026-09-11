import type { GifEntry } from '$lib/requests/models/GifEntry.ts';
import type { CommentDraftGif } from '../models/CommentDraftGif.ts';

export function toCommentDraftGif(gif: GifEntry): CommentDraftGif {
  return {
    url: gif.url,
    slug: gif.slug,
    previewUrl: gif.preview.url,
    stillUrl: gif.still?.url,
    width: gif.preview.width,
    height: gif.preview.height,
  };
}

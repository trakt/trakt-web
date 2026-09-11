/** A gif lifted back off a stored comment has only `url`; `previewUrl` falls back to it. */
export type CommentDraftGif = {
  url: string;
  // What the share ping reports once the comment is live.
  slug?: string;
  previewUrl: string;
  stillUrl?: string;
  // Sized alike, so one pair reserves the slot for either.
  width?: number;
  height?: number;
};

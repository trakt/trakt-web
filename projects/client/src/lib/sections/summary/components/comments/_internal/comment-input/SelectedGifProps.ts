import type { CommentDraftGif } from '../models/CommentDraftGif.ts';

export type SelectedGifProps = {
  gif: CommentDraftGif;
  onRemove: () => void;
  disabled?: boolean;
};

import type { CommentDraftGif } from '../models/CommentDraftGif.ts';
import type { SelectedGifProps } from './SelectedGifProps.ts';

export type ComposerGifProps = Omit<SelectedGifProps, 'gif'> & {
  gif: CommentDraftGif | null;
};

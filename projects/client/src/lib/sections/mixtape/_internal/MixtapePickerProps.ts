import type { MediaInputDefault } from '$lib/models/MediaInput.ts';
import type { PickerItems } from './PickerItems.ts';

export type MixtapePickerProps = {
  picker: PickerItems<MediaInputDefault>;
  isLoading: boolean;
  isSettling: boolean;
  isFull: boolean;
  pickHref: (media: MediaInputDefault) => string;
  onPick: (source: 'grid' | 'search') => void;
};

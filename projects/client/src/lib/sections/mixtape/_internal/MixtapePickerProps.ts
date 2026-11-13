import type { MediaInputDefault } from '$lib/models/MediaInput.ts';
import type { PickerItems } from './PickerItems.ts';

export type MixtapePickerPhase = 'pick' | 'full' | 'mixing';

export type MixtapePickerProps = {
  picker: PickerItems<MediaInputDefault>;
  isLoading: boolean;
  isSettling: boolean;
  phase: MixtapePickerPhase;
  pickHref: (media: MediaInputDefault) => string;
  removeHref: (media: MediaInputDefault) => string;
  onPick: (
    source: 'grid' | 'search',
    media: MediaInputDefault,
    from: DOMRect | null,
  ) => void;
};

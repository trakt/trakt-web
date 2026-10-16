import type { MediaInputDefault } from '$lib/models/MediaInput.ts';

export type MixtapeTrayProps = {
  picks: ReadonlyArray<number>;
  picked: ReadonlyArray<MediaInputDefault>;
  removeHref: (id: number) => string;
  onAdd: () => void;
};

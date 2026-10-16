import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
import type { MixtapeSlot } from './MixtapeSlot.ts';

export type MixtapeDoneProps = {
  kept: ReadonlyArray<MixtapeSlot>;
  picked: ReadonlyArray<MovieEntry | ShowEntry>;
  closeHref: string;
  changeHref: string;
  startOverHref: string;
  onMore: (() => void) | null;
};

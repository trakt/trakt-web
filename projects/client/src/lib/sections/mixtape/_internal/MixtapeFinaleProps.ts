import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
import type { MixtapeTarget } from './MixtapeTarget.ts';

export type MixtapeFinaleProps = {
  rounds: ReadonlyArray<ReadonlyArray<MovieEntry | ShowEntry>>;
  picked: ReadonlyArray<MovieEntry | ShowEntry>;
  savedTo: MixtapeTarget;
  closeHref: string;
  changeHref: string;
  startOverHref: string;
  onMore: (() => void) | null;
  onMoved: (target: MixtapeTarget) => void;
  matchOf: (id: number) => number | null;
  becauseOf: (id: number) => string | null;
};

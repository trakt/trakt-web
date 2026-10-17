import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
import type { MixtapeTarget } from './MixtapeTarget.ts';

type Media = MovieEntry | ShowEntry;

export type MixtapeSavedToProps = {
  kept: ReadonlyArray<Media>;
  picked: ReadonlyArray<Media>;
  savedTo: MixtapeTarget;
  onMoved: (target: MixtapeTarget) => void;
};

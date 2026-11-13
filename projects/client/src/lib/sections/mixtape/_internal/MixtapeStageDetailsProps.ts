import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';

export type MixtapeStageDetailsProps = {
  media: MovieEntry | ShowEntry;
  kicker: string | null;
};

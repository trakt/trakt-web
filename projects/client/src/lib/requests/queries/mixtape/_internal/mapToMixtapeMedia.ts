import { mapToMovieEntry } from '$lib/requests/_internal/mapToMovieEntry.ts';
import { mapToShowEntry } from '$lib/requests/_internal/mapToShowEntry.ts';
import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
import type { MixtapeMediaResponse } from './MixtapeMediaResponseSchema.ts';

export function mapToMixtapeMedia(
  response: MixtapeMediaResponse,
): MovieEntry | ShowEntry | null {
  if (response.movie) return mapToMovieEntry(response.movie);
  if (response.show) return mapToShowEntry(response.show);
  return null;
}

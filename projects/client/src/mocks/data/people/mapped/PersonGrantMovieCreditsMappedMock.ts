import type { MediaCredits } from '$lib/requests/models/MediaCredits.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';

export const PersonGrantMovieCreditsMappedMock: MediaCredits = new Map([
  ['acting', [MovieHereticMappedMock]],
]);

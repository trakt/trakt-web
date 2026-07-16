import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';

export const SmartListItemsMappedMock: MediaEntry[] = [
  ShowSiloMappedMock,
  MovieHereticMappedMock,
];

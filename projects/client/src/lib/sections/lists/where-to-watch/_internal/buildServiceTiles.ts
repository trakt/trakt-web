import type { StreamingServiceOption } from '$lib/requests/models/StreamingServiceOptions.ts';
import type { LibraryOption } from '../models/LibraryOption.ts';
import type { YouTubeSpecialOption } from '../models/YouTubeSpecialOption.ts';

type BuildServiceTilesParams = {
  justWatchServices: StreamingServiceOption[];
  plexServices: LibraryOption[];
  youtubeTile?: YouTubeSpecialOption | Nil;
  isMobile: boolean;
};

export function buildServiceTiles(
  { justWatchServices, plexServices, youtubeTile, isMobile }:
    BuildServiceTilesParams,
) {
  const tiles = isMobile
    ? [...plexServices, ...justWatchServices]
    : justWatchServices;

  return youtubeTile ? [youtubeTile, ...tiles] : tiles;
}

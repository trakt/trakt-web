import type { SoundtrackTrack } from '$lib/requests/models/SoundtrackTrack.ts';

export function filterBySeason(
  tracks: ReadonlyArray<SoundtrackTrack>,
  season: number | null,
): ReadonlyArray<SoundtrackTrack> {
  if (season === null) return tracks;
  return tracks.filter((track) =>
    track.season == null || track.season === season
  );
}

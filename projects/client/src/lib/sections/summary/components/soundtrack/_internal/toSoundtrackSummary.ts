import type { SoundtrackTrack } from '$lib/requests/models/SoundtrackTrack.ts';

export type SoundtrackSummary = {
  total: number;
  playable: number;
  credit: string | null;
};

// The credit line names whoever is behind most of the listing - a score is
// usually one composer, a compilation soundtrack has no single owner and so
// gets no credit line at all.
function toDominantPerformer(tracks: ReadonlyArray<SoundtrackTrack>) {
  const counts = tracks.reduce((acc, track) => {
    const performer = track.performer?.trim();

    if (!performer) {
      return acc;
    }

    return acc.set(performer, (acc.get(performer) ?? 0) + 1);
  }, new Map<string, number>());

  const [dominant] = Array.from(counts.entries())
    .sort(([, a], [, b]) => b - a);

  if (!dominant) {
    return null;
  }

  const [performer, count] = dominant;

  return count > tracks.length / 2 ? performer : null;
}

export function toSoundtrackSummary(
  tracks: ReadonlyArray<SoundtrackTrack>,
): SoundtrackSummary {
  return {
    total: tracks.length,
    playable: tracks.filter((track) => Boolean(track.spotifyId)).length,
    credit: toDominantPerformer(tracks),
  };
}

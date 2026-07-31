/**
 * Roster achievements we cannot compute client-side today. Each needs data the
 * app doesn't currently load, so they're parked here (documented, not wired)
 * and easy to promote into the live catalog once the API can provide it. This
 * list is intentionally not imported anywhere - it's a tracked backlog.
 */
export type PendingBackendAchievement = {
  id: string;
  title: string;
  bucket: string;
  /** The data we'd need before this can become a real catalog entry. */
  needs: string;
};

export const pendingBackendAchievements: ReadonlyArray<
  PendingBackendAchievement
> = [
  {
    id: 'release-day-episode',
    title: 'Premier Night',
    bucket: 'timing',
    needs:
      'per-episode air date (first_aired) joined to watch history to diff against watched_at',
  },
  {
    id: 'release-day-season',
    title: 'Day-One Binger',
    bucket: 'timing',
    needs: 'season episode air dates + same-day completion detection',
  },
  {
    id: 'release-day-movie',
    title: 'Opening Night',
    bucket: 'timing',
    needs: 'per-movie release date joined to watch history',
  },
  {
    id: 'marathon-runner',
    title: 'Franchise Marathon',
    bucket: 'timing',
    needs: 'collection/franchise membership (which titles form a collection)',
  },
  {
    id: 'genre-polymath',
    title: 'Diverse Palette',
    bucket: 'volume',
    needs: 'per-watched-item genres (history does not carry genres)',
  },
  {
    id: 'list-popular',
    title: 'Taste Tastemaker',
    bucket: 'curation',
    needs:
      "likes received on the member's own lists (only likes given are exposed client-side)",
  },
];

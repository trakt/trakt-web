// The merged song list: every IMDb credit plus the tracks of the official
// albums. Songs we could not resolve simply carry a null `spotify_id`.
//
// `position` is IMDb order first, then album-only tracks. It is a stable total
// order, which is why it is the only thing sorted on.
export const SOUNDTRACK_INFO = {
  infoType: 15,
  infoVersion: 2,
} as const;

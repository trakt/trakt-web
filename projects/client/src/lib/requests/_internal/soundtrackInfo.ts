// Spotify-resolved soundtrack credits. Every credited track is present; the
// ones we could not resolve simply carry a null `spotify_id`.
//
// `position` is screen order within a movie, and sequence across the series on
// a show aggregate. Either way it is a stable total order, which is why it is
// the only thing sorted on.
export const SOUNDTRACK_INFO = {
  infoType: 15,
  infoVersion: 1,
} as const;

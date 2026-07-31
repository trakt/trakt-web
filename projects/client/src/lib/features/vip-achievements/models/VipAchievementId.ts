/**
 * Stable identifier for each VIP achievement in the catalog. Used to key
 * catalog definitions, resolved state, and the icon lookup.
 */
export type VipAchievementId =
  // Volume & mileage
  | 'time-spent-movies'
  | 'time-spent-episodes'
  | 'century-club'
  | 'active-logger'
  // Binge & velocity
  | 'daily-streak'
  | 'night-owl'
  | 'marathon-fever'
  | 'show-completionist'
  | 're-watcher'
  // Ratings & reviews
  | 'perfect-ten'
  | 'harsh-critic'
  | 'rating-machine'
  | 'scribe'
  | 'balanced-critic'
  // Timing
  | 'double-feature'
  // Curation & limits
  | 'list-maker'
  | 'vault-keeper'
  | 'vip-limit-breaker'
  | 'plex-archivist'
  // VIP prestige
  | 'vip-loyalty'
  | 'trakt-veteran'
  | 'life-backer'
  | 'phoenix-rescue'
  | 'director-flair';

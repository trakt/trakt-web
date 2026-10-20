/**
 * Stable identifier for each achievement in the catalog. Used to key catalog
 * definitions, resolved state, and the icon lookup.
 */
export type VipAchievementId =
  // Watching
  | 'century-club'
  | 'time-spent-episodes'
  | 'time-spent-movies'
  | 'show-completionist'
  // Habits
  | 'daily-streak'
  | 'night-owl'
  | 'marathon-fever'
  | 'double-feature'
  // Ratings & reviews
  | 'rating-machine'
  | 'perfect-ten'
  | 'scribe'
  // Lists
  | 'list-maker';

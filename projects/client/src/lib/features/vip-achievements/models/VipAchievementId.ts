/**
 * Stable identifier for each achievement in the catalog. Used to key catalog
 * definitions, resolved state, and the icon lookup.
 */
export type VipAchievementId =
  // Getting started
  | 'opening-credits'
  // Watching
  | 'century-club'
  | 'time-spent-episodes'
  | 'time-spent-movies'
  | 'show-completionist'
  | 'feature-presentation'
  | 'pilot-season'
  | 'nostalgia-trip'
  | 'long-haul'
  // Habits
  | 'daily-streak'
  | 'night-owl'
  | 'marathon-fever'
  | 'double-feature'
  | 'early-bird'
  | 'season-ticket'
  | 'weekly-ritual'
  // Ratings & reviews
  | 'rating-machine'
  | 'perfect-ten'
  | 'scribe'
  | 'full-spectrum'
  | 'hard-to-please'
  | 'instant-verdict'
  | 'episode-by-episode'
  // Lists and collection
  | 'list-maker'
  | 'hall-of-fame'
  | 'shelf-life'
  // Social
  | 'ensemble-cast'
  | 'fan-club'
  // Legacy
  | 'trakt-pioneer'
  | 'credits-roll'
  // Secret
  | 'countdown'
  | 'leap-day'
  | 'groundhog-day';

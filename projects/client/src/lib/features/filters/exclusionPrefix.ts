/*
  Excluded multi-select values are serialized inline in the same filter param,
  prefixed with a minus (e.g. `genres=action,-comedy`). Keeping exclusions in
  the same key means simple filters, smart-list URLs, and filter preservation
  keep working unchanged - they never emit the prefix.
*/
export const EXCLUSION_PREFIX = '-';

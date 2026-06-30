/**
 * A Year-in-Review period selector: a concrete year (e.g. `2024`) or the
 * literal `'all'` for the all-time view. Interpolates directly into the API
 * path (`/users/{slug}/yir/{year}`), which accepts both a 4-digit year and the
 * literal `all`.
 */
export type YirYear = number | 'all';

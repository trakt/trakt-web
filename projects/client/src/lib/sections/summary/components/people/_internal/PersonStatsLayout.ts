/**
 * Where the credit stats sit in the masthead.
 *
 * `inline` is the default: the counts fold into the links row as quiet text
 * before the socials - no crown columns at all, the portrait alone, and the work
 * summarized in a whisper rather than on a plinth.
 *
 * `flank` put them either side of the portrait to fill the band's empty
 * shoulders at no vertical cost - and read as a silly pair of ears, which is how
 * `inline` came to be. Kept reachable for the comparison.
 *
 * `below` is the stacked line `flank` replaced, kept for the same reason.
 */
export type PersonStatsLayout = 'flank' | 'below' | 'inline';

const LAYOUTS: ReadonlyArray<PersonStatsLayout> = ['flank', 'below', 'inline'];

const DEFAULT_LAYOUT: PersonStatsLayout = 'inline';

/** The search parameter that selects the layout, e.g. `?stats=flank`. */
export const PERSON_STATS_PARAM = 'stats';

export function toPersonStatsLayout(value: string | Nil): PersonStatsLayout {
  return LAYOUTS.find((layout) => layout === value) ?? DEFAULT_LAYOUT;
}

/**
 * Where the credit stats sit in the masthead.
 *
 * `flank` is the default and the reason this exists: the header is a wide band with
 * a ~220px portrait in the middle of it, so there is a great deal of unused space
 * either side. Putting the stats there costs no vertical height at all, and fills
 * the emptiness that made the composition feel bare in the first place - two
 * problems, one move.
 *
 * `below` is the stacked line it replaced, kept reachable so the two can be
 * compared rather than argued about.
 *
 * `inline` folds the counts into the links row as quiet text before the socials.
 * The flanks were read as a silly pair of ears on the portrait, and this is the
 * counter-proposal: no crown columns at all, the portrait alone, and the work
 * summarized in a whisper rather than on a plinth.
 */
export type PersonStatsLayout = 'flank' | 'below' | 'inline';

const LAYOUTS: ReadonlyArray<PersonStatsLayout> = ['flank', 'below', 'inline'];

const DEFAULT_LAYOUT: PersonStatsLayout = 'flank';

/** The search parameter that selects the layout, e.g. `?stats=below`. */
export const PERSON_STATS_PARAM = 'stats';

export function toPersonStatsLayout(value: string | Nil): PersonStatsLayout {
  return LAYOUTS.find((layout) => layout === value) ?? DEFAULT_LAYOUT;
}

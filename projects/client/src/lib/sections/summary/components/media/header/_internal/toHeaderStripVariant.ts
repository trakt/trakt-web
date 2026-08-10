/**
 * Which form the masthead's data strip takes.
 *
 * `glance` is the default: one compact pill referencing every section, opening
 * the at-a-glance drawer. `columns` is the five-column strip it replaced - the
 * full sections spread across the card - kept reachable so the two directions
 * can be compared on the spot rather than by switching branches.
 */
export type HeaderStripVariant = 'glance' | 'columns';

const VARIANTS: ReadonlyArray<HeaderStripVariant> = ['glance', 'columns'];

const DEFAULT_VARIANT: HeaderStripVariant = 'glance';

/** The search parameter that selects the variant, e.g. `?strip=columns`. */
export const HEADER_STRIP_PARAM = 'strip';

export function toHeaderStripVariant(
  value: string | Nil,
): HeaderStripVariant {
  return VARIANTS.find((variant) => variant === value) ?? DEFAULT_VARIANT;
}

/**
 * Which form the masthead's data strip takes.
 *
 * `glance` is the default: one compact pill referencing every section, each
 * token drilling into its own drawer. `labeled` is the same pill with each
 * token naming itself underneath. `columns` is the five-column strip they
 * replaced - kept reachable so the directions can be compared on the spot
 * rather than by switching branches.
 */
export type HeaderStripVariant = 'glance' | 'labeled' | 'columns';

const VARIANTS: ReadonlyArray<HeaderStripVariant> = [
  'glance',
  'labeled',
  'columns',
];

const DEFAULT_VARIANT: HeaderStripVariant = 'glance';

/** The search parameter that selects the variant, e.g. `?strip=columns`. */
export const HEADER_STRIP_PARAM = 'strip';

export function toHeaderStripVariant(
  value: string | Nil,
): HeaderStripVariant {
  return VARIANTS.find((variant) => variant === value) ?? DEFAULT_VARIANT;
}

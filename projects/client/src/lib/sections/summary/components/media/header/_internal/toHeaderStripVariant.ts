/**
 * Which form the masthead's data strip takes.
 *
 * `labeled` is the default: the compact pill with every token naming itself
 * underneath, each drilling into its own drawer. `glance` is the same pill
 * with bare tokens (tooltips carry the names instead). `columns` is the
 * five-column strip they replaced - kept reachable so the directions can be
 * compared on the spot rather than by switching branches.
 */
export type HeaderStripVariant = 'glance' | 'labeled' | 'columns';

const VARIANTS: ReadonlyArray<HeaderStripVariant> = [
  'glance',
  'labeled',
  'columns',
];

const DEFAULT_VARIANT: HeaderStripVariant = 'labeled';

/** The search parameter that selects the variant, e.g. `?strip=columns`. */
export const HEADER_STRIP_PARAM = 'strip';

export function toHeaderStripVariant(
  value: string | Nil,
): HeaderStripVariant {
  return VARIANTS.find((variant) => variant === value) ?? DEFAULT_VARIANT;
}

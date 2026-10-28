/**
 * How the masthead arranges the rate row and the action bar.
 *
 * `stacked` is the default: the live product's own composition, rate row above
 * the tray. `fused` seats the stars on the tray's own dark surface, a hairline
 * bar between them - one horizontal control instead of two bands. Kept as a
 * URL variant so the two can be compared on the spot.
 */
export type HeaderActionsVariant = 'stacked' | 'fused';

const VARIANTS: ReadonlyArray<HeaderActionsVariant> = ['stacked', 'fused'];

const DEFAULT_VARIANT: HeaderActionsVariant = 'stacked';

/** The search parameter that selects the variant, e.g. `?actions=fused`. */
export const HEADER_ACTIONS_PARAM = 'actions';

export function toHeaderActionsVariant(
  value: string | Nil,
): HeaderActionsVariant {
  return VARIANTS.find((variant) => variant === value) ?? DEFAULT_VARIANT;
}

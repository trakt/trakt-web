type UnitMessage = () => string;

/**
 * Picks the singular or plural unit noun for a count. The project's Paraglide
 * setup does not compile ICU `plural` syntax, so each unit is authored as a
 * singular/plural key pair (`yir_unit_show` / `yir_unit_shows`) and selected
 * here by count.
 */
export function yirUnit(
  count: number,
  one: UnitMessage,
  other: UnitMessage,
): string {
  return count === 1 ? one() : other();
}

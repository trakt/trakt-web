/** Total of every value. Empty input is `0` (additive identity). */
export function sum(values: ReadonlyArray<number>): number {
  return values.reduce((total, value) => total + value, 0);
}

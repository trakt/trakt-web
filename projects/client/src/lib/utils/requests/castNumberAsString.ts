/**
 * FIXME: https://github.com/ts-rest/ts-rest/issues/777
 *
 * This function is a workaround for the issue where ts-rest ignores falsy path params.
 */
export function castNumberAsString(value: number): number {
  return `${value}` as unknown as number;
}

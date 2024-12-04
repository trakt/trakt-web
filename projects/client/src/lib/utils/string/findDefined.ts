export function findDefined(
  ...values: Array<string | Nil>
) {
  return values.find((value) => value?.trim());
}

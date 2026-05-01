export function findMaxIndex(values: number[]): number {
  if (values.length === 0) return -1;

  const maxValue = Math.max(...values);
  return values.indexOf(maxValue);
}

export function formatDecimal(value: number | Nil): string {
  return (value ?? 0).toFixed(1);
}

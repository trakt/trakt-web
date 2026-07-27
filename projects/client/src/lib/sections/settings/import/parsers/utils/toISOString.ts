const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function toISOString(value?: string): string | undefined {
  if (!value) return undefined;

  const normalized = DATE_ONLY_PATTERN.test(value)
    ? `${value}T12:00:00`
    : value;

  const date = new Date(normalized);
  return isNaN(date.getTime()) ? undefined : date.toISOString();
}

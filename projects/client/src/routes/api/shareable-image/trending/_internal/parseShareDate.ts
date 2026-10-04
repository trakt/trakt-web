const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function parseShareDate(value: string | null): Date {
  if (!value || !DAY_PATTERN.test(value)) return new Date();

  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

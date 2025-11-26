import type { DatePart } from '$lib/models/DatePart.ts';

export function buildLocalDate(parts: DatePart): Date {
  return new Date(
    parts.year,
    parts.month,
    parts.day,
    parts.hour ?? 0,
    parts.minute ?? 0,
    parts.second ?? 0,
  );
}

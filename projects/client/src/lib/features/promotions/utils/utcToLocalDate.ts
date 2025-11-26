import type { DatePart } from '$lib/models/DatePart.ts';

export function utcToLocalDate(utcDate: DatePart): Date {
  return new Date(Date.UTC(
    utcDate.year,
    utcDate.month,
    utcDate.day,
    utcDate.hour ?? 0,
    utcDate.minute ?? 0,
    utcDate.second ?? 0,
  ));
}

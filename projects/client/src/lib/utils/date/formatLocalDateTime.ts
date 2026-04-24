import { format } from 'date-fns/format';

export function formatLocalDateTime(date: Date): string {
  return format(date, "yyyy-MM-dd'T'HH:mm");
}

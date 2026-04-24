import { format } from 'date-fns/format';

export function formatLocalDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

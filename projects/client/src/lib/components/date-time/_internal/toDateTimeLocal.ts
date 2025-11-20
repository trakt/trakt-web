import { format } from 'date-fns/format';

export function toDateTimeLocal(date?: Date) {
  if (!date) {
    return;
  }

  return format(date, "yyyy-MM-dd'T'HH:mm");
}

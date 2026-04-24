import { formatLocalDateTime } from '../../../utils/date/formatLocalDateTime.ts';

export function formatDateInputValue(
  date: Date | undefined,
) {
  if (!date) return undefined;
  return formatLocalDateTime(date);
}

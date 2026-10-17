import type { SortDirection } from './models/SortDirection.ts';

export function toSortDirection(
  value: string | Nil,
): SortDirection | undefined {
  return value === 'asc' || value === 'desc' ? value : undefined;
}

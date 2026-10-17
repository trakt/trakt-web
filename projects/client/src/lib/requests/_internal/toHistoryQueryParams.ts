import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';

type ToHistoryQueryParamsProps = {
  startDate?: Date;
  endDate?: Date;
  syncId?: number;
} & PaginationParams &
  FilterParams;

export function toHistoryQueryParams({
  startDate,
  endDate,
  limit,
  page,
  syncId,
  filter,
}: ToHistoryQueryParamsProps) {
  return {
    extended: 'full,images' as const,
    start_at: startDate?.toISOString(),
    end_at: endDate?.toISOString(),
    limit,
    page,
    sync_id: syncId,
    ...filter,
  };
}

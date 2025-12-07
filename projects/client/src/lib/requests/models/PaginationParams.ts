import type { LimitParams } from '$lib/requests/models/LimitParams.ts';

export type PaginationParams = {
  page?: number;
} & LimitParams;

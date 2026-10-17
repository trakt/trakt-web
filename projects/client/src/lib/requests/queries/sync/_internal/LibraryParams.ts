import { type ApiParams } from '$lib/requests/api.ts';
import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';

export type LibraryParams = ApiParams & PaginationParams & {
  availableOn?: 'digital' | 'other';
  type?: DiscoverMode;
};

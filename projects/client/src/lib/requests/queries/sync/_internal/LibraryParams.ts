import { type ApiParams } from '$lib/requests/api.ts';
import type { DiscoverMode } from '../../../../features/discover/models/DiscoverMode.ts';
import type { PaginationParams } from '../../../models/PaginationParams.ts';

export type LibraryParams = ApiParams & PaginationParams & {
  availableOn?: 'plex' | 'other';
  type?: DiscoverMode;
};

import type { SmartListFilters } from '$lib/requests/models/SmartListFilters.ts';

export const SHOW_ONLY_SMART_LIST_FILTERS: ReadonlyArray<
  keyof SmartListFilters
> = ['networks', 'ignore_watching', 'ignore_ended', 'ignore_airing'];

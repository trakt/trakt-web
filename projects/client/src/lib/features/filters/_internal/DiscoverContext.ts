import type { BehaviorSubject } from 'rxjs';

export const DISCOVER_CONTEXT_KEY = Symbol('discover-context');

export type DiscoverContext = {
  useSeasonalFilters: BehaviorSubject<boolean>;
};

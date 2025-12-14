import type { BehaviorSubject } from 'rxjs';
import type { DiscoverMode } from '../models/DiscoverMode.ts';

export const DISCOVER_CONTEXT_KEY = Symbol('discover-context');

export type DiscoverContext = {
  mode: BehaviorSubject<DiscoverMode>;
  useSeasonalFilters: BehaviorSubject<boolean>;
};

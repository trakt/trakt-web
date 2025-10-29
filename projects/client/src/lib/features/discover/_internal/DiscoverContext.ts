import type { Readable, Writable } from 'svelte/store';
import type { DiscoverMode } from '../models/DiscoverMode.ts';

export const DISCOVER_CONTEXT_KEY = Symbol('discover-context');

export type DiscoverContext = {
  mode: Writable<DiscoverMode>;
  routes: Readable<string[]>;
  useSeasonalFilters: Writable<boolean>;
};

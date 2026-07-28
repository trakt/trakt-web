import type { FilterSurface } from '$lib/features/filters/models/FilterSurface.ts';
import type { NavbarMode } from '$lib/sections/navbar/useNavbarState.ts';
import type { Snippet } from 'svelte';
import type { NavbarHeaderState } from './NavbarHeaderState.ts';

export type NavbarStateSetterProps = {
  actions?: Snippet;
  contextualActions?: Snippet;
  toastActions?: Snippet | Nil;
  mode?: NavbarMode;
  hasFilters?: boolean;
  showFilters?: boolean;
  /** Opts the page into filters that only apply to one feed - see `FilterSurface`. */
  filterSurface?: FilterSurface;
  headerActions?: Snippet;
  header?: NavbarHeaderState;
  sidebar?: {
    mode: 'default' | 'fixed';
  };
};

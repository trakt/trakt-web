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
  headerActions?: Snippet;
  header?: NavbarHeaderState;
  sidebar?: {
    mode: 'default' | 'fixed';
  };
};

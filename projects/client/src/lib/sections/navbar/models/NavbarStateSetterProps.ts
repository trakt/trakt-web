import type { NavbarMode } from '$lib/sections/navbar/useNavbarState.ts';
import type { Snippet } from 'svelte';

export type NavbarStateSetterProps = {
  actions?: Snippet;
  contextualActions?: Snippet;
  toastActions?: Snippet | Nil;
  mode?: NavbarMode;
  hasFilters?: boolean;
  showFilters?: boolean;
  headerActions?: Snippet;
  header?: {
    title: string;
    metaInfo?: string | Snippet;
    actions?: Snippet;
  };
  sidebar?: {
    mode: 'default' | 'fixed';
  };
};

import type { Snippet } from 'svelte';
import { readonly, type Writable, writable } from 'svelte/store';

export type NavbarMode = 'full' | 'minimal' | 'hidden';

type NavbarState = {
  actions: Snippet | undefined;
  seasonalActions: Snippet | undefined;
  contextualActions: Snippet | undefined;
  mode: NavbarMode;
  hasFilters: boolean;
};

const initialNavbarState: NavbarState = {
  actions: undefined,
  seasonalActions: undefined,
  contextualActions: undefined,
  mode: 'hidden',
  hasFilters: false,
};

const navbarStateStore: Writable<NavbarState> = writable(initialNavbarState);

export function useNavbarState() {
  return {
    state: readonly(navbarStateStore),
    set: (props: Partial<NavbarState>) => {
      const definedProps = Object.fromEntries(
        Object.entries(props).filter(([_, v]) => v !== undefined),
      ) as Partial<NavbarState>;

      navbarStateStore.update((current) => ({
        ...current,
        ...definedProps,
      }));
    },
    reset: () => {
      navbarStateStore.set(initialNavbarState);
    },
  };
}

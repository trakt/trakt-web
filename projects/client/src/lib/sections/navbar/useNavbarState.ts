import type { Snippet } from 'svelte';
import { derived, type Writable, writable } from 'svelte/store';

export type NavbarMode = 'full' | 'minimal' | 'hidden';

type NavbarState = {
  actions: Snippet | undefined;
  seasonalActions: Snippet | undefined;
  contextualActions: Snippet | undefined;
  hasFilters: boolean;
};

type GlobalNavbarState = {
  toastActions: Snippet | Nil;
  mode: NavbarMode;
};

const globalNavbarStateStore: Writable<GlobalNavbarState> = writable({
  toastActions: null,
  mode: 'hidden',
});

const initialNavbarState: NavbarState = {
  actions: undefined,
  seasonalActions: undefined,
  contextualActions: undefined,
  hasFilters: false,
};

const navbarStateStore: Writable<NavbarState> = writable(
  initialNavbarState,
);

export function useNavbarState() {
  return {
    state: derived(
      [navbarStateStore, globalNavbarStateStore],
      ([$navbarStateStore, $globalNavbarStateStore]) => ({
        ...$navbarStateStore,
        ...$globalNavbarStateStore,
      }),
    ),
    set: (props: Partial<NavbarState>) => {
      navbarStateStore.update((current) => {
        const definedProps = Object.fromEntries(
          Object.entries(props).filter(([_, v]) => v !== undefined),
        ) as Partial<NavbarState>;

        return {
          ...current,
          ...definedProps,
        };
      });
    },
    globalSet: (props: Partial<GlobalNavbarState>) => {
      globalNavbarStateStore.update((current) => ({
        ...current,
        ...props,
      }));
    },
    reset: () => {
      navbarStateStore.set(initialNavbarState);
    },
  };
}

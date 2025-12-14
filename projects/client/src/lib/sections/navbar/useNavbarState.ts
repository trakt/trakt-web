type Nil = null | undefined;
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import type { Snippet } from 'svelte';

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

const globalNavbarStateStore = new BehaviorSubject<GlobalNavbarState>({
  toastActions: null,
  mode: 'hidden',
});

const initialNavbarState: NavbarState = {
  actions: undefined,
  seasonalActions: undefined,
  contextualActions: undefined,
  hasFilters: false,
};

const navbarStateStore = new BehaviorSubject<NavbarState>(
  initialNavbarState,
);

export function useNavbarState() {
  return {
    state: combineLatest(
      [navbarStateStore, globalNavbarStateStore],
    ).pipe(
      map(([$navbarStateStore, $globalNavbarStateStore]) => ({
        ...$navbarStateStore,
        ...$globalNavbarStateStore,
      })),
    ),
    set: (props: Partial<NavbarState>) => {
      const current = navbarStateStore.value;
      const definedProps = Object.fromEntries(
        Object.entries(props).filter(([_, v]) => v !== undefined),
      ) as Partial<NavbarState>;

      navbarStateStore.next({
        ...current,
        ...definedProps,
      });
    },
    globalSet: (props: Partial<GlobalNavbarState>) => {
      const current = globalNavbarStateStore.value;
      globalNavbarStateStore.next({
        ...current,
        ...props,
      });
    },
    reset: () => {
      navbarStateStore.next(initialNavbarState);
    },
  };
}

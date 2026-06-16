type Nil = null | undefined;
import { multicast } from '$lib/utils/store/multicast.ts';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
} from 'rxjs';
import type { Snippet } from 'svelte';
import { isShallowEqual } from '$lib/utils/object/isShallowEqual.ts';

export type NavbarMode = 'full' | 'minimal' | 'hidden';

type NavbarState = {
  actions: Snippet | undefined;
  contextualActions: Snippet | undefined;
  hasFilters: boolean;
  showFilters: boolean;
  headerActions?: Snippet;
  header?: {
    title: string;
    metaInfo?: string | Snippet;
    actions?: Snippet;
  };
  sidebar: {
    mode: 'default' | 'fixed';
  };
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
  contextualActions: undefined,
  hasFilters: false,
  showFilters: true,
  headerActions: undefined,
  header: undefined,
  sidebar: {
    mode: 'default',
  },
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
      distinctUntilChanged(isShallowEqual),
      multicast(),
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

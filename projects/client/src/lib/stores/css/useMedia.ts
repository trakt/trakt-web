import { browser } from '$app/environment';
import {
  breakpointDesktop,
  breakpointMobile,
  breakpointTabletLgMax,
  breakpointTabletLgMin,
  breakpointTabletSmMax,
  breakpointTabletSmMin,
} from '$style/scss/variables/index.ts';
import { fromEvent, Observable, of } from 'rxjs';
import { map, shareReplay, startWith } from 'rxjs/operators';

export const WellKnownMediaQuery = {
  mobile: `(max-width: ${breakpointMobile})`,
  tabletSmall:
    `(min-width: ${breakpointTabletSmMin}) and (max-width: ${breakpointTabletSmMax})`,
  tabletLarge:
    `(min-width: ${breakpointTabletLgMin}) and (max-width: ${breakpointTabletLgMax})`,
  desktop: `(min-width: ${breakpointDesktop})`,
  mouse: '(hover: hover) and (pointer: fine)',
  touch: '(hover: none) and (pointer: coarse)',
};

class MediaQueryManager {
  private static instance: MediaQueryManager;
  private queries: Map<string, Observable<boolean>> = new Map();

  private constructor() {
    // constructor is private to prevent instantiation
  }

  static getInstance(): MediaQueryManager {
    if (!this.instance) {
      this.instance = new MediaQueryManager();
    }
    return this.instance;
  }

  observe(query: string): Observable<boolean> {
    if (!browser) {
      return of(false);
    }

    const cached = this.queries.get(query);

    if (!cached) {
      const mediaQuery = globalThis.matchMedia(query);

      const observer = fromEvent<MediaQueryListEvent>(mediaQuery, 'change')
        .pipe(
          map((event) => event.matches),
          startWith(mediaQuery.matches),
          shareReplay(1),
        );

      this.queries.set(query, observer);
      return observer;
    }

    return cached;
  }

  static matches(query: string): boolean {
    if (!browser) return false;
    return globalThis.matchMedia(query).matches;
  }
}

export function useMedia(query: string): Observable<boolean> {
  return MediaQueryManager.getInstance().observe(query);
}

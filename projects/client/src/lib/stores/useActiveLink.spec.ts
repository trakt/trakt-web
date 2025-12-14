import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useActiveLink } from './useActiveLink.ts';

let pagePathname = '/initial';
vi.mock('$app/state', () => ({
  page: {
    get url() {
      return { pathname: pagePathname };
    },
  },
}));

type NavEvent = { to?: { url: { pathname: string } } };
let afterNavigateCallback: ((nav: NavEvent) => void) | undefined;
vi.mock('$app/navigation', () => ({
  afterNavigate: (cb: (nav: NavEvent) => void) => {
    afterNavigateCallback = cb;
  },
}));

describe('useActiveLink', () => {
  beforeEach(() => {
    pagePathname = '/initial';
    afterNavigateCallback = undefined;
  });

  it('should initialize with correct active state', () => {
    const { isActive } = useActiveLink('/initial');
    let value;
    const sub = isActive.subscribe((v) => (value = v));
    sub.unsubscribe();
    expect(value).toBe(true);
  });

  it('should initialize as inactive for non-matching route', () => {
    const { isActive } = useActiveLink('/other');
    let value;
    const sub = isActive.subscribe((v) => (value = v));
    sub.unsubscribe();
    expect(value).toBe(false);
  });

  it('should update active state on navigation', () => {
    const { isActive } = useActiveLink('/new');
    // Simulate navigation
    if (afterNavigateCallback) {
      afterNavigateCallback({ to: { url: { pathname: '/new' } } });
    }
    let value;
    const sub = isActive.subscribe((v) => (value = v));
    sub.unsubscribe();
    expect(value).toBe(true);
  });

  it('should handle null href', () => {
    const { isActive } = useActiveLink(null);
    let value;
    const sub = isActive.subscribe((v) => (value = v));
    sub.unsubscribe();
    expect(value).toBe(false);
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { appendGlobalParameters } from './appendGlobalParameters.ts';

let pageUrl = new URL('https://app.trakt.tv/profile/userA');
let afterNavigateCallback: (() => void) | undefined;

vi.mock('$app/state', () => ({
  page: {
    get params() {
      return {};
    },
    get url() {
      return pageUrl;
    },
  },
}));

vi.mock('$app/navigation', () => ({
  afterNavigate: (cb: () => void) => {
    afterNavigateCallback = cb;
  },
}));

const mockSvelteContextStore = new Map();

vi.mock('svelte', async (importOriginal) => {
  const actual = await importOriginal<typeof import('svelte')>();
  return {
    ...actual,
    setContext: (key: symbol, value: unknown) => {
      mockSvelteContextStore.set(key, value);
      return value;
    },
    getContext: (key: symbol) => mockSvelteContextStore.get(key),
  };
});

/**
 * Changes jsdom's window.location.href (which appendGlobalParameters resolves
 * relative hrefs against) and fires any afterNavigate callback.
 */
function navigate(pathname: string) {
  globalThis.window.history.pushState({}, '', pathname);
  pageUrl = new URL(pathname, globalThis.window.location.href);
  afterNavigateCallback?.();
}

function makeAnchor(href: string): HTMLAnchorElement {
  const anchor = document.createElement('a');
  anchor.setAttribute('href', href);
  document.body.appendChild(anchor);
  return anchor;
}

describe('appendGlobalParameters', () => {
  beforeEach(() => {
    mockSvelteContextStore.clear();
    globalThis.window.history.pushState({}, '', '/profile/userA');
    pageUrl = new URL('/profile/userA', globalThis.window.location.href);
    afterNavigateCallback = undefined;
  });

  afterEach(() => {
    document.body.replaceChildren();
  });

  it('appends global search params to the anchor href', () => {
    const anchor = makeAnchor('/profile/userA');
    appendGlobalParameters(anchor, '/profile/userA');

    expect(new URL(anchor.href).pathname).toBe('/profile/userA');
    expect(new URL(anchor.href).search).toBe('');
  });

  it('preserves non-whitelisted params from the original href', () => {
    const anchor = makeAnchor('/profile/userA?page=2');
    appendGlobalParameters(anchor, '/profile/userA?page=2');

    expect(new URL(anchor.href).searchParams.get('page')).toBe('2');
  });

  it('does not bake the pathname after navigation, update() uses new href', () => {
    const anchor = makeAnchor('?mode=movie');
    const action = appendGlobalParameters(anchor, '?mode=movie');

    expect(new URL(anchor.href).pathname).toBe('/profile/userA');

    navigate('/profile/userB');
    action.update('?mode=movie');

    expect(new URL(anchor.href).pathname).toBe('/profile/userB');
  });

  it('updates originalHref when update() receives a new href', () => {
    const anchor = makeAnchor('/profile/userA');
    const action = appendGlobalParameters(anchor, '/profile/userA');

    action.update('/profile/userB');

    expect(new URL(anchor.href).pathname).toBe('/profile/userB');
  });

  it('keeps the old originalHref when update() receives nullish', () => {
    const anchor = makeAnchor('/profile/userA');
    const action = appendGlobalParameters(anchor, '/profile/userA');

    action.update(undefined);

    expect(new URL(anchor.href).pathname).toBe('/profile/userA');
  });

  it('skips external links', () => {
    const anchor = makeAnchor('https://example.com/page');
    appendGlobalParameters(anchor, 'https://example.com/page');

    expect(new URL(anchor.href).origin).toBe('https://example.com');
    expect(new URL(anchor.href).pathname).toBe('/page');
  });

  it('unsubscribes from the RxJS stream on destroy', () => {
    const anchor = makeAnchor('/profile/userA');
    const action = appendGlobalParameters(anchor, '/profile/userA');

    const hrefAfterMount = anchor.href;
    action.destroy();

    // After destroy the subscription is gone. navigate() fires afterNavigate
    // which would update the BehaviorSubjects inside createParameterContext,
    // potentially re-triggering applyParams via the subscription, but it won't
    // because the subscription has been torn down.
    navigate('/profile/userB');

    // href must not have been mutated by the subscription firing
    expect(anchor.href).toBe(hrefAfterMount);
  });
});

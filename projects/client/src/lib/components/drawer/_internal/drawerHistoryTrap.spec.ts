import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type FakeEntry = { url: URL; state: App.PageState };

const browser = vi.hoisted(() => ({
  entries: [] as Array<{ url: URL; state: App.PageState }>,
  index: 0,
  pageUrl: new URL('about:blank'),
}));

const current = (): FakeEntry => {
  const entry = browser.entries.at(browser.index);
  if (!entry) throw new Error('fake history is empty');
  return entry;
};

const toUrl = (url: string | URL) =>
  url === '' ? current().url : new URL(url, browser.pageUrl);

vi.mock('$app/state', () => ({
  page: {
    get url() {
      return browser.pageUrl;
    },
    get state() {
      return current().state;
    },
  },
}));

vi.mock('$app/navigation', () => ({
  goto: vi.fn((url: string | URL, options: { state?: App.PageState } = {}) => {
    browser.pageUrl = toUrl(url);
    browser.entries = browser.entries.with(browser.index, {
      url: browser.pageUrl,
      state: options.state ?? {},
    });
    return Promise.resolve();
  }),
  pushState: vi.fn((url: string | URL, state: App.PageState) => {
    const entry = { url: toUrl(url), state };
    browser.entries = [...browser.entries.slice(0, browser.index + 1), entry];
    browser.index += 1;
  }),
  replaceState: vi.fn((url: string | URL, state: App.PageState) => {
    browser.entries = browser.entries.with(browser.index, {
      url: toUrl(url),
      state,
    });
  }),
}));

const PAGE_URL = 'https://trakt.tv/movies/heretic-2024';

const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

const go = vi.fn((delta = 0) => {
  browser.index += delta;
  browser.pageUrl = current().url;
  setTimeout(() => globalThis.dispatchEvent(new PopStateEvent('popstate')));
});

const replaceCurrent = (url: string, state: App.PageState) => {
  browser.pageUrl = new URL(url);
  browser.entries = browser.entries.with(browser.index, {
    url: browser.pageUrl,
    state,
  });
};

const loadTrap = async () =>
  (await import('./drawerHistoryTrap.ts')).drawerHistoryTrap;

describe('drawerHistoryTrap', () => {
  const popstateListeners: EventListenerOrEventListenerObject[] = [];

  beforeEach(() => {
    vi.resetModules();
    browser.entries = [{ url: new URL(PAGE_URL), state: {} }];
    browser.index = 0;
    browser.pageUrl = new URL(PAGE_URL);
    go.mockClear();

    vi.spyOn(globalThis.history, 'go').mockImplementation(go);
    vi.spyOn(globalThis.history, 'back').mockImplementation(() => go(-1));

    const addEventListener = globalThis.addEventListener.bind(globalThis);
    vi.spyOn(globalThis, 'addEventListener').mockImplementation(
      (type, listener, options) => {
        if (type === 'popstate' && listener) popstateListeners.push(listener);
        addEventListener(type, listener, options);
      },
    );
  });

  afterEach(() => {
    popstateListeners.forEach((listener) =>
      globalThis.removeEventListener('popstate', listener),
    );
    popstateListeners.length = 0;
    vi.restoreAllMocks();
  });

  it('should push a history entry that carries the trap id', async () => {
    const trap = await loadTrap();

    const id = trap.push(vi.fn());

    expect(browser.entries).toHaveLength(2);
    expect(current().state.drawerTraps).toEqual([id]);
    expect(trap.isActive(id)).toBe(true);
    expect(trap.isTrapped()).toBe(true);
  });

  it('should call onPop once when back pops the trap entry', async () => {
    const trap = await loadTrap();
    const onPop = vi.fn();
    trap.push(onPop);

    globalThis.history.back();
    await settle();

    expect(onPop).toHaveBeenCalledOnce();
    expect(trap.isTrapped()).toBe(false);
  });

  describe('browser transition', () => {
    const popBack = (hasUAVisualTransition: boolean) => {
      browser.index -= 1;
      browser.pageUrl = current().url;
      const event = new PopStateEvent('popstate');
      Object.defineProperty(event, 'hasUAVisualTransition', {
        value: hasUAVisualTransition,
      });
      globalThis.dispatchEvent(event);
    };

    it('should report it before the url is restored and the drawer closes', async () => {
      const trap = await loadTrap();
      const onPop = vi.fn();
      const onBrowserTransition = vi.fn();
      trap.push(onPop, onBrowserTransition);
      replaceCurrent(`${PAGE_URL}?season=3`, current().state);
      trap.restore();

      popBack(true);

      expect(onBrowserTransition).toHaveBeenCalledOnce();
      expect(onPop).not.toHaveBeenCalled();

      await settle();

      expect(onPop).toHaveBeenCalledOnce();
    });

    it('should not report it when the browser did not animate the back', async () => {
      const trap = await loadTrap();
      const onPop = vi.fn();
      const onBrowserTransition = vi.fn();
      trap.push(onPop, onBrowserTransition);

      popBack(false);
      await settle();

      expect(onBrowserTransition).not.toHaveBeenCalled();
      expect(onPop).toHaveBeenCalledOnce();
    });
  });

  it('should only close the top drawer when stacked', async () => {
    const trap = await loadTrap();
    const onPopParent = vi.fn();
    const onPopChild = vi.fn();
    const parentId = trap.push(onPopParent);
    trap.push(onPopChild);

    globalThis.history.back();
    await settle();

    expect(onPopChild).toHaveBeenCalledOnce();
    expect(onPopParent).not.toHaveBeenCalled();
    expect(trap.isActive(parentId)).toBe(true);
  });

  it('should keep the latest url when back closes the drawer', async () => {
    const trap = await loadTrap();
    trap.push(vi.fn());
    replaceCurrent(`${PAGE_URL}?genres=horror`, current().state);
    trap.restore();

    globalThis.history.back();
    await settle();

    expect(browser.index).toBe(0);
    expect(current().url.search).toBe('?genres=horror');
    expect(browser.pageUrl.search).toBe('?genres=horror');
  });

  it('should restore the latest url before the drawer closes', async () => {
    const trap = await loadTrap();
    const seenUrls: string[] = [];
    trap.push(() => seenUrls.push(browser.pageUrl.search));
    replaceCurrent(`${PAGE_URL}?season=3`, current().state);
    trap.restore();

    globalThis.history.back();
    await settle();

    expect(seenUrls).toEqual(['?season=3']);
  });

  it('should ignore a back that lands on an entry still holding the trap', async () => {
    const trap = await loadTrap();
    const onPop = vi.fn();
    const id = trap.push(onPop);
    browser.entries = [
      ...browser.entries,
      { url: new URL(`${PAGE_URL}?page=2`), state: { drawerTraps: [id] } },
    ];
    browser.index += 1;

    globalThis.history.back();
    await settle();

    expect(onPop).not.toHaveBeenCalled();
    expect(trap.isActive(id)).toBe(true);
  });

  describe('remove', () => {
    it('should step back over the trap entry of a closed drawer', async () => {
      const trap = await loadTrap();
      const onPop = vi.fn();
      const id = trap.push(onPop);

      trap.remove(id);
      await settle();

      expect(go).toHaveBeenCalledExactlyOnceWith(-1);
      expect(browser.index).toBe(0);
      expect(onPop).not.toHaveBeenCalled();
    });

    it('should keep the url changes made while the drawer was open', async () => {
      const trap = await loadTrap();
      const id = trap.push(vi.fn());
      replaceCurrent(`${PAGE_URL}?genres=horror`, current().state);

      trap.remove(id);
      await settle();

      expect(browser.index).toBe(0);
      expect(current().url.search).toBe('?genres=horror');
      expect(browser.pageUrl.search).toBe('?genres=horror');
    });

    it('should jump once over drawers closed in the same tick', async () => {
      const trap = await loadTrap();
      const parentId = trap.push(vi.fn());
      const childId = trap.push(vi.fn());

      trap.remove(childId);
      trap.remove(parentId);
      await settle();

      expect(go).toHaveBeenCalledExactlyOnceWith(-2);
      expect(browser.index).toBe(0);
    });

    it('should not move history when a drawer below the top closes', async () => {
      const trap = await loadTrap();
      const parentId = trap.push(vi.fn());
      const childId = trap.push(vi.fn());

      trap.remove(parentId);
      await settle();

      expect(go).not.toHaveBeenCalled();
      expect(trap.isActive(childId)).toBe(true);
    });

    it('should ignore unknown ids', async () => {
      const trap = await loadTrap();
      trap.push(vi.fn());

      trap.remove('unknown');
      await settle();

      expect(go).not.toHaveBeenCalled();
      expect(trap.isTrapped()).toBe(true);
    });
  });

  describe('release', () => {
    it('should jump back over every trap entry and resolve', async () => {
      const trap = await loadTrap();
      const onPopParent = vi.fn();
      const onPopChild = vi.fn();
      trap.push(onPopParent);
      trap.push(onPopChild);

      await trap.release();

      expect(go).toHaveBeenCalledExactlyOnceWith(-2);
      expect(browser.index).toBe(0);
      expect(trap.isTrapped()).toBe(false);
      expect(onPopParent).not.toHaveBeenCalled();
      expect(onPopChild).not.toHaveBeenCalled();
    });

    it('should resolve without moving history when nothing is trapped', async () => {
      const trap = await loadTrap();

      await trap.release();

      expect(go).not.toHaveBeenCalled();
    });

    it('should not step back again when a released drawer closes', async () => {
      const trap = await loadTrap();
      const id = trap.push(vi.fn());

      await trap.release();
      trap.remove(id);
      await settle();

      expect(go).toHaveBeenCalledOnce();
    });
  });

  describe('restore', () => {
    it('should put the trap ids back after a replace wiped them', async () => {
      const trap = await loadTrap();
      const id = trap.push(vi.fn());
      replaceCurrent(`${PAGE_URL}?tab=b`, {});

      expect(trap.isTrapped()).toBe(false);

      trap.restore();

      expect(current().state.drawerTraps).toEqual([id]);
      expect(current().url.search).toBe('?tab=b');
      expect(trap.isActive(id)).toBe(true);
    });

    it('should leave the state alone when the ids are still there', async () => {
      const trap = await loadTrap();
      trap.push(vi.fn());
      const state = current().state;

      trap.restore();

      expect(current().state).toBe(state);
    });
  });

  describe('own navigation', () => {
    it('should recognise a marked url once', async () => {
      const trap = await loadTrap();
      const url = new URL(`${PAGE_URL}?tab=b`);

      trap.markOwnNavigation(url);

      expect(trap.isOwnNavigation(new URL(url))).toBe(true);
      expect(trap.isOwnNavigation(new URL(url))).toBe(false);
    });

    it('should not recognise other urls', async () => {
      const trap = await loadTrap();

      trap.markOwnNavigation(new URL(`${PAGE_URL}?tab=b`));

      expect(trap.isOwnNavigation(new URL(`${PAGE_URL}?tab=c`))).toBe(false);
    });
  });
});

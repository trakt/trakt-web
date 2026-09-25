import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import bootLoaderTemplate from './_internal/bootLoader.html?raw';

const STYLESHEET_COUNT = 2;

function mountBootLoader() {
  const stylesheets = Array.from({ length: STYLESHEET_COUNT }, () => {
    const link = document.createElement('link');
    link.setAttribute('data-boot-css', '');
    document.head.append(link);
    return link;
  });

  document.body.innerHTML = `${
    bootLoaderTemplate
      .replace('%boot.css%', `${STYLESHEET_COUNT}`)
      .replace('%boot.js%', '1')
  }<div class="app">page</div>`;

  Array.from(document.body.querySelectorAll('script'))
    .forEach((script) => new Function(script.textContent ?? '')());

  return stylesheets;
}

function settle(links: ReadonlyArray<HTMLLinkElement>) {
  links.forEach((link) =>
    Object.defineProperty(link, 'sheet', {
      configurable: true,
      value: {},
    })
  );
}

function unsettle(links: ReadonlyArray<HTMLLinkElement>) {
  links.forEach((link) =>
    Object.defineProperty(link, 'sheet', {
      configurable: true,
      value: null,
    })
  );
}

const boot = () => document.documentElement.dataset.boot;

describe('boot loader', () => {
  beforeEach(() => {
    vi.useFakeTimers({
      toFake: [
        'requestAnimationFrame',
        'cancelAnimationFrame',
        'performance',
        'setTimeout',
        'clearTimeout',
      ],
    });
    vi.spyOn(globalThis, 'matchMedia').mockImplementation((query) => ({
      matches: query.includes('reduce'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    document.head.querySelectorAll('link[data-boot-css]')
      .forEach((link) => link.remove());
    document.body.innerHTML = '';
    delete document.documentElement.dataset.boot;
  });

  it('should skip the loader when styles land before it appears', () => {
    const stylesheets = mountBootLoader();

    vi.advanceTimersByTime(200);
    settle(stylesheets);
    vi.advanceTimersByTime(50);

    expect(document.querySelector('.boot-loader')).toBeNull();
    expect(boot()).toBeUndefined();
  });

  it('should keep the loader until it has been visible long enough', () => {
    const stylesheets = mountBootLoader();

    vi.advanceTimersByTime(450);
    settle(stylesheets);

    vi.advanceTimersByTime(650);
    expect(boot()).toBe('loading');

    vi.advanceTimersByTime(150);
    expect(boot()).toBe('styled');
  });

  it('should let the fill finish before handing off after slow styles', () => {
    const stylesheets = mountBootLoader();

    vi.advanceTimersByTime(2000);
    settle(stylesheets);

    vi.advanceTimersByTime(250);
    expect(boot()).toBe('loading');

    vi.advanceTimersByTime(100);
    expect(boot()).toBe('styled');
  });

  it('should hide the page until the loader hands off', () => {
    const stylesheets = mountBootLoader();
    const page = document.querySelector('.app');

    vi.advanceTimersByTime(450);
    settle(stylesheets);
    vi.advanceTimersByTime(650);
    expect(page && getComputedStyle(page).visibility).toBe('hidden');

    vi.advanceTimersByTime(150);
    expect(page && getComputedStyle(page).visibility).toBe('visible');
  });
});

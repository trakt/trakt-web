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
      .replaceAll('%boot.delay%', '1000')
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
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    document.head.querySelectorAll('link[data-boot-css]')
      .forEach((link) => link.remove());
    document.body.innerHTML = '';
    delete document.documentElement.dataset.boot;
    document.documentElement.removeAttribute('data-app-ready');
  });

  it('should skip the splash when styles land before it appears', () => {
    const stylesheets = mountBootLoader();

    vi.advanceTimersByTime(900);
    settle(stylesheets);
    vi.advanceTimersByTime(50);

    expect(document.querySelector('.boot-loader-splash')).toBeNull();
    expect(document.querySelector('.boot-loader-bar')).not.toBeNull();
    expect(boot()).toBe('styled');
  });

  it('should keep the bar until the app is ready after skipping the splash', () => {
    const stylesheets = mountBootLoader();

    vi.advanceTimersByTime(900);
    settle(stylesheets);
    vi.advanceTimersByTime(50);

    document.documentElement.setAttribute('data-app-ready', '');
    vi.advanceTimersByTime(800);

    expect(document.querySelector('.boot-loader')).toBeNull();
    expect(boot()).toBeUndefined();
  });

  it('should keep the loader until it has been visible long enough', () => {
    const stylesheets = mountBootLoader();

    vi.advanceTimersByTime(1050);
    settle(stylesheets);

    vi.advanceTimersByTime(650);
    expect(boot()).toBe('loading');

    vi.advanceTimersByTime(150);
    expect(boot()).toBe('styled');
  });

  it('should let the fill finish before handing off after slow styles', () => {
    const stylesheets = mountBootLoader();

    vi.advanceTimersByTime(3000);
    settle(stylesheets);

    vi.advanceTimersByTime(250);
    expect(boot()).toBe('loading');

    vi.advanceTimersByTime(100);
    expect(boot()).toBe('styled');
  });

  it('should hide the page until the loader hands off', () => {
    const stylesheets = mountBootLoader();
    const page = document.querySelector('.app');

    vi.advanceTimersByTime(1050);
    settle(stylesheets);
    vi.advanceTimersByTime(650);
    expect(page && getComputedStyle(page).visibility).toBe('hidden');

    vi.advanceTimersByTime(150);
    expect(page && getComputedStyle(page).visibility).toBe('visible');
  });

  it('should never move the progress backwards', () => {
    const stylesheets = mountBootLoader();
    const percent = () =>
      document.querySelector('.boot-loader-percent')?.textContent;

    vi.advanceTimersByTime(1050);
    settle(stylesheets);
    vi.advanceTimersByTime(20);
    const settled = percent();
    expect(settled).toBe('40%');

    unsettle(stylesheets);
    vi.advanceTimersByTime(20);
    expect(percent()).toBe(settled);
  });
});

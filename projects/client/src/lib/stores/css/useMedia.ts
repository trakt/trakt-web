import { browser } from '$app/environment';
import { onDestroy, onMount } from 'svelte';
import { writable } from 'svelte/store';

export const enum WellKnownMediaQuery {
  mobile = '(max-width: 480px)',
  tabletSmall = '(min-width: 481px) and (max-width: 768px)',
  tabletLarge = '(min-width: 769px) and (max-width: 1023px)',
  desktop = '(min-width: 1024px)',
}

type MediaCallback = () => void;

class MediaQueryManager {
  private static instance: MediaQueryManager;
  private queries: Map<string, {
    mediaQuery: MediaQueryList;
    callbacks: Set<MediaCallback>;
  }> = new Map();

  private constructor() {}

  static getInstance(): MediaQueryManager {
    if (!this.instance) {
      this.instance = new MediaQueryManager();
    }
    return this.instance;
  }

  subscribe(query: string, callback: MediaCallback): () => void {
    if (!browser) {
      return () => {};
    }

    if (!this.queries.has(query)) {
      const mediaQuery = globalThis.matchMedia(query);
      this.queries.set(query, {
        mediaQuery,
        callbacks: new Set(),
      });

      mediaQuery.addEventListener('change', () => {
        this.queries.get(query)?.callbacks.forEach((cb) => cb());
      });
    }

    const entry = this.queries.get(query)!;
    entry.callbacks.add(callback);

    callback();

    return () => {
      entry.callbacks.delete(callback);
      if (entry.callbacks.size === 0) {
        this.queries.delete(query);
      }
    };
  }

  matches(query: string): boolean {
    if (!browser) return false;
    return globalThis.matchMedia(query).matches;
  }
}

export function useMedia(query: string) {
  const value = writable(false);
  const manager = MediaQueryManager.getInstance();

  onMount(() => {
    const unsubscribe = manager.subscribe(query, () => {
      value.set(manager.matches(query));
    });

    onDestroy(unsubscribe);
  });

  return value;
}

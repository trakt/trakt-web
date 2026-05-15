import { vi } from 'vitest';

Object.defineProperty(window, 'localStorage', {
  value: (() => {
    const store: Map<string, string> = new Map();

    return {
      getItem: vi.fn(function (key: string) {
        return store.get(key);
      }),
      setItem: vi.fn(function (key: string, value: string) {
        return store.set(key, value);
      }),
      removeItem: vi.fn(function (key: string) {
        return store.delete(key);
      }),
      clear: vi.fn(function () {
        return store.clear();
      }),
      key: vi.fn(function (index: number) {
        return Array.from(store.keys())[index] ?? null;
      }),
      get length() {
        return store.size;
      },
    };
  })(),
});

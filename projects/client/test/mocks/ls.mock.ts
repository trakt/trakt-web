import { vi } from 'vitest';

Object.defineProperty(window, 'localStorage', {
  value: (() => {
    const store: Map<string, string> = new Map();

    return {
      getItem: vi.fn((key: string) => store.get(key)),
      setItem: vi.fn((key: string, value: string) => store.set(key, value)),
      clear: vi.fn(() => store.clear()),
    };
  })(),
});

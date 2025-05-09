import { vi } from 'vitest';

Object.defineProperty(
  window,
  'scrollTo',
  {
    value: vi.fn(),
    writable: true,
    configurable: true,
  },
);

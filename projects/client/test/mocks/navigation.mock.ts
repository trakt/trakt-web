import { vi } from 'vitest';

vi.mock('$app/navigation', () => ({
  goto: vi.fn(function () {
    return Promise.resolve();
  }),
  replaceState: vi.fn(function () {}),
  beforeNavigate: vi.fn(function () {}),
  afterNavigate: vi.fn(function () {}),
}));

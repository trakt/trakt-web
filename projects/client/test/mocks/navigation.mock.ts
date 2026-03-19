import { vi } from 'vitest';

vi.mock('$app/navigation', () => ({
  goto: vi.fn(function () {
    return Promise.resolve();
  }),
  beforeNavigate: vi.fn(function () {}),
  afterNavigate: vi.fn(function () {}),
}));

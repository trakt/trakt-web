import { vi } from 'vitest';

vi.mock('$app/state', () => ({
  page: {
    get url() {
      return new URL(window.location.href);
    },
  },
}));

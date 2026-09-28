import { vi } from 'vitest';

export const goto = vi.fn(function () {
  return Promise.resolve();
});
export const beforeNavigate = vi.fn(function () {});
export const afterNavigate = vi.fn(function () {});

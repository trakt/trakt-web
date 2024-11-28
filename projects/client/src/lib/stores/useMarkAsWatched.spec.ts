import { describe, expect, it, vi } from 'vitest';
import { resolveWatchDate } from './useMarkAsWatched.ts';

describe('useMarkAsWatched', () => {
  it('should resolve correct date for a given user action', () => {
    expect(resolveWatchDate('released')).toBe(
      'released',
    );
  });

  it('should resolve current date for unknown action', () => {
    const now = new Date().toISOString();
    vi.setSystemTime(new Date(now));
    expect(resolveWatchDate(undefined)).toBe(now);
    vi.useRealTimers();
  });

  it('should resolve current date for "now" action', () => {
    const now = new Date().toISOString();
    vi.setSystemTime(new Date(now));
    expect(resolveWatchDate('now')).toBe(now);
    vi.useRealTimers();
  });

  it('should resolve current date for "ask" action', () => {
    const prompt = globalThis.prompt;
    globalThis.prompt = vi.fn(() => '2037-01-01T00:00:00.000Z');
    expect(resolveWatchDate('ask')).toBe(
      '2037-01-01T00:00:00.000Z',
    );
    globalThis.prompt = prompt;
  });

  it('should resolve undefined for "ask" action when prompt is cancelled', () => {
    const prompt = globalThis.prompt;
    globalThis.prompt = vi.fn(() => null);
    expect(resolveWatchDate('ask')).toBe(undefined);
    globalThis.prompt = prompt;
  });
});

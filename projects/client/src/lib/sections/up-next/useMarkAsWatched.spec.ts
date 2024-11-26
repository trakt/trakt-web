import { resolveWatchDate } from '$lib/sections/up-next/useMarkAsWatched.ts';
import { describe, expect, it, vi } from 'vitest';

describe('useMarkAsWatched', () => {
  it('should resolve correct date for a given user action', () => {
    expect(resolveWatchDate('released', new Date('2022-01-01'))).toBe(
      '2022-01-01T00:00:00.000Z',
    );
  });

  it('should resolve current date for unknown action', () => {
    expect(resolveWatchDate(undefined, new Date('2022-01-01'))).toBe(
      new Date().toISOString(),
    );
  });

  it('should resolve current date for "now" action', () => {
    expect(resolveWatchDate('now', new Date('2022-01-01'))).toBe(
      new Date().toISOString(),
    );
  });

  it('should resolve current date for "ask" action', () => {
    const prompt = globalThis.prompt;
    globalThis.prompt = vi.fn(() => '2037-01-01T00:00:00.000Z');
    expect(resolveWatchDate('ask', new Date('2022-01-01'))).toBe(
      '2037-01-01T00:00:00.000Z',
    );
    globalThis.prompt = prompt;
  });

  it('should resolve undefined for "ask" action when prompt is cancelled', () => {
    const prompt = globalThis.prompt;
    globalThis.prompt = vi.fn(() => null);
    expect(resolveWatchDate('ask', new Date('2022-01-01'))).toBe(undefined);
    globalThis.prompt = prompt;
  });
});

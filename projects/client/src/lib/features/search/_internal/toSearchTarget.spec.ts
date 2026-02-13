import { describe, expect, it } from 'vitest';
import { toSearchTarget } from './toSearchTarget.ts';

describe('toSearchTarget', () => {
  it('should return "people" mode when mode is "people"', () => {
    const result = toSearchTarget('people');
    expect(result.mode).toBe('people');
  });

  it('should return "media" mode when mode is "media"', () => {
    const result = toSearchTarget('media');
    expect(result.mode).toBe('media');
  });

  it('should return undefined mode when mode is null', () => {
    const result = toSearchTarget(null);
    expect(result.mode).toBeUndefined();
  });

  it('should return undefined mode when mode is empty string', () => {
    const result = toSearchTarget('');
    expect(result.mode).toBeUndefined();
  });

  it('should return undefined mode when mode is invalid string', () => {
    const result = toSearchTarget('invalid');
    expect(result.mode).toBeUndefined();
  });

  it('should return "movie" mediaType when mode is "movie"', () => {
    const result = toSearchTarget('movie');
    expect(result.mode).toBe('movie');
  });

  it('should return "show" mediaType when mode is "show"', () => {
    const result = toSearchTarget('show');
    expect(result.mode).toBe('show');
  });

  it('should return "media" mode when mode is "lists"', () => {
    const result = toSearchTarget('lists');
    expect(result.mode).toBe('lists');
  });
});

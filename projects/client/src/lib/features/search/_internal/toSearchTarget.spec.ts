import { describe, expect, it } from 'vitest';
import { toSearchTarget } from './toSearchTarget.ts';

describe('toSearchTarget', () => {
  it('should return "people" mode when mode is "people"', () => {
    const result = toSearchTarget('people', null);
    expect(result.mode).toBe('people');
  });

  it('should return "media" mode when mode is "media"', () => {
    const result = toSearchTarget('media', null);
    expect(result.mode).toBe('media');
  });

  it('should return undefined mode when mode is null', () => {
    const result = toSearchTarget(null, null);
    expect(result.mode).toBeUndefined();
  });

  it('should return undefined mode when mode is empty string', () => {
    const result = toSearchTarget('', null);
    expect(result.mode).toBeUndefined();
  });

  it('should return undefined mode when mode is invalid string', () => {
    const result = toSearchTarget('invalid', null);
    expect(result.mode).toBeUndefined();
  });

  it('should return "movie" mediaType when type is "movie"', () => {
    const result = toSearchTarget(null, 'movie');
    expect(result.mediaType).toBe('movie');
  });

  it('should return "show" mediaType when type is "show"', () => {
    const result = toSearchTarget(null, 'show');
    expect(result.mediaType).toBe('show');
  });

  it('should return undefined mediaType when type is null', () => {
    const result = toSearchTarget(null, null);
    expect(result.mediaType).toBeUndefined();
  });

  it('should return undefined mediaType when type is empty string', () => {
    const result = toSearchTarget(null, '');
    expect(result.mediaType).toBeUndefined();
  });

  it('should return undefined mediaType when type is invalid string', () => {
    const result = toSearchTarget(null, 'invalid');
    expect(result.mediaType).toBeUndefined();
  });

  it('should return both valid mode and mediaType', () => {
    const result = toSearchTarget('people', 'movie');
    expect(result.mode).toBe('people');
    expect(result.mediaType).toBe('movie');
  });

  it('should return both valid mode and mediaType for media and show', () => {
    const result = toSearchTarget('media', 'show');
    expect(result.mode).toBe('media');
    expect(result.mediaType).toBe('show');
  });

  it('should return valid mode and undefined mediaType when mediaType is invalid', () => {
    const result = toSearchTarget('people', 'invalid');
    expect(result.mode).toBe('people');
    expect(result.mediaType).toBeUndefined();
  });

  it('should return undefined mode and valid mediaType when mode is invalid', () => {
    const result = toSearchTarget('invalid', 'movie');
    expect(result.mode).toBeUndefined();
    expect(result.mediaType).toBe('movie');
  });

  it('should return both undefined when both parameters are invalid', () => {
    const result = toSearchTarget('invalid', 'invalid');
    expect(result.mode).toBeUndefined();
    expect(result.mediaType).toBeUndefined();
  });
});

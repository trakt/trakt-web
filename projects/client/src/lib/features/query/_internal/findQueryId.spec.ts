import { describe, expect, it } from 'vitest';
import { findQueryId } from './findQueryId.ts';
import { queryId } from './queryId.ts';

describe('findQueryId', () => {
  it('should find query id in array', () => {
    const key = queryId('test');
    const result = findQueryId([key]);
    expect(result).toBe(key);
  });

  it('should return undefined when no query id found', () => {
    const result = findQueryId(['test', 123, true]);
    expect(result).toBeUndefined();
  });

  it('should find query id among other values', () => {
    const key = queryId('test');
    const result = findQueryId(['other', 123, key, false]);
    expect(result).toBe(key);
  });

  it('should return undefined for empty array', () => {
    const result = findQueryId([]);
    expect(result).toBeUndefined();
  });
});

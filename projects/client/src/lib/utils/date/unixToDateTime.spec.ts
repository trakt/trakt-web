import { describe, expect, test } from 'vitest';
import { unixToDateTime } from './unixToDateTime.ts';

describe('util -> date -> unixToDateTime', () => {
  test('valid positive Unix timestamp', () => {
    const unix = 1609459200; // 2021-01-01T00:00:00.000Z
    const result = unixToDateTime(unix);
    expect(result).toEqual('2021-01-01T00:00:00.000Z');
  });

  test('Unix timestamp of 1', () => {
    const unix = 1;
    const result = unixToDateTime(unix);
    expect(result).toEqual('1970-01-01T00:00:01.000Z');
  });

  test('Unix timestamp of 0', () => {
    const unix = 0;
    const result = unixToDateTime(unix);
    expect(result).toEqual('1970-01-01T00:00:00.000Z');
  });

  test('negative Unix timestamp', () => {
    const unix = -1;
    const result = unixToDateTime(unix);
    expect(result).toEqual('1969-12-31T23:59:59.000Z');
  });

  test('null input', () => {
    const unix = null;
    const result = unixToDateTime(unix);
    expect(result).toEqual(null);
  });

  test('undefined input', () => {
    const unix = undefined;
    const result = unixToDateTime(unix);
    expect(result).toEqual(null);
  });

  test('NaN input', () => {
    const unix = NaN;
    const result = unixToDateTime(unix);
    expect(result).toEqual(null);
  });

  test('large Unix timestamp', () => {
    const unix = 2147483647; // Max 32-bit signed integer
    const result = unixToDateTime(unix);
    expect(result).toEqual('2038-01-19T03:14:07.000Z');
  });

  test('fractional Unix timestamp', () => {
    const unix = 1609459200.5;
    const result = unixToDateTime(unix);
    expect(result).toEqual('2021-01-01T00:00:00.500Z');
  });
});

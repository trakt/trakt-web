import { describe, expect, it } from 'vitest';
import { extractPageMeta } from './extractPageMeta.ts';

describe('extractPageMeta', () => {
  it('should extract paginated page meta from headers with valid values', () => {
    const headers = new Headers({
      'x-pagination-page': '5',
      'x-pagination-page-count': '10',
    });

    const result = extractPageMeta(headers);

    expect(result).toEqual({
      type: 'paginated',
      current: 5,
      total: 10,
    });
  });

  it('should return infinite type when page count header is missing', () => {
    const headers = new Headers();

    const result = extractPageMeta(headers);

    expect(result).toEqual({
      type: 'infinite',
      current: 1,
    });
  });

  it('should use fallbackPage when page count header is missing', () => {
    const headers = new Headers();

    const result = extractPageMeta(headers, 3);

    expect(result).toEqual({
      type: 'infinite',
      current: 3,
    });
  });

  it('should return infinite type when only page count header is absent', () => {
    const headers = new Headers({
      'x-pagination-page': '3',
    });

    const result = extractPageMeta(headers);

    expect(result).toEqual({
      type: 'infinite',
      current: 1,
    });
  });

  it('should default current to 1 when current page header is missing', () => {
    const headers = new Headers({
      'x-pagination-page-count': '20',
    });

    const result = extractPageMeta(headers);

    expect(result).toEqual({
      type: 'paginated',
      current: 1,
      total: 20,
    });
  });

  it('should handle invalid current page value by defaulting to 1', () => {
    const headers = new Headers({
      'x-pagination-page': 'invalid',
      'x-pagination-page-count': '10',
    });

    const result = extractPageMeta(headers);

    expect(result).toEqual({
      type: 'paginated',
      current: 1,
      total: 10,
    });
  });

  it('should handle invalid total page count by defaulting to 1', () => {
    const headers = new Headers({
      'x-pagination-page': '5',
      'x-pagination-page-count': 'invalid',
    });

    const result = extractPageMeta(headers);

    expect(result).toEqual({
      type: 'paginated',
      current: 1,
      total: 1,
    });
  });

  it('should handle zero current page by converting to 1', () => {
    const headers = new Headers({
      'x-pagination-page': '0',
      'x-pagination-page-count': '10',
    });

    const result = extractPageMeta(headers);

    expect(result).toEqual({
      type: 'paginated',
      current: 1,
      total: 10,
    });
  });

  it('should handle negative current page by converting to 1', () => {
    const headers = new Headers({
      'x-pagination-page': '-5',
      'x-pagination-page-count': '10',
    });

    const result = extractPageMeta(headers);

    expect(result).toEqual({
      type: 'paginated',
      current: 1,
      total: 10,
    });
  });

  it('should handle zero total page count by converting to 1', () => {
    const headers = new Headers({
      'x-pagination-page': '1',
      'x-pagination-page-count': '0',
    });

    const result = extractPageMeta(headers);

    expect(result).toEqual({
      type: 'paginated',
      current: 1,
      total: 1,
    });
  });

  it('should handle negative total page count by converting to 1', () => {
    const headers = new Headers({
      'x-pagination-page': '1',
      'x-pagination-page-count': '-10',
    });

    const result = extractPageMeta(headers);

    expect(result).toEqual({
      type: 'paginated',
      current: 1,
      total: 1,
    });
  });

  it('should handle decimal values by truncating to integers', () => {
    const headers = new Headers({
      'x-pagination-page': '5.7',
      'x-pagination-page-count': '10.9',
    });

    const result = extractPageMeta(headers);

    expect(result).toEqual({
      type: 'paginated',
      current: 5,
      total: 10,
    });
  });

  it('should handle first page and last page correctly', () => {
    const headers = new Headers({
      'x-pagination-page': '1',
      'x-pagination-page-count': '1',
    });

    const result = extractPageMeta(headers);

    expect(result).toEqual({
      type: 'paginated',
      current: 1,
      total: 1,
    });
  });

  it('should handle large page numbers', () => {
    const headers = new Headers({
      'x-pagination-page': '999',
      'x-pagination-page-count': '1000',
    });

    const result = extractPageMeta(headers);

    expect(result).toEqual({
      type: 'paginated',
      current: 999,
      total: 1000,
    });
  });

  it('should handle mismatching counts', () => {
    const headers = new Headers({
      'x-pagination-page': '123',
      'x-pagination-page-count': '10',
    });

    const result = extractPageMeta(headers);

    expect(result).toEqual({
      type: 'paginated',
      current: 10,
      total: 10,
    });
  });
});

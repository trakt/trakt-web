import { describe, expect, it } from 'vitest';
import { toKlipyUpstreamQuery } from './toKlipyUpstreamQuery.ts';

const query = (search: string) =>
  toKlipyUpstreamQuery(
    new URL(`http://localhost/api/klipy/gifs/search${search}`),
  )
    .toString();

describe('util: toKlipyUpstreamQuery', () => {
  it('should forward the parameters the picker sends', () => {
    expect(query('?q=cats&page=2&customer_id=device-1'))
      .toBe('q=cats&page=2&customer_id=device-1');
  });

  it('should drop parameters the picker does not send', () => {
    expect(query('?q=cats&api_key=stolen&callback=evil')).toBe('q=cats');
  });

  it('should cap the page size', () => {
    expect(query('?per_page=999')).toBe('per_page=50');
    expect(query('?per_page=24')).toBe('per_page=24');
  });

  it('should fall back to the cap for a page size that is not a number', () => {
    expect(query('?per_page=all')).toBe('per_page=50');
  });

  it('should fall back to the cap for a page size below one', () => {
    expect(query('?per_page=0')).toBe('per_page=50');
    expect(query('?per_page=-10')).toBe('per_page=50');
  });

  it('should return nothing for a request with no parameters', () => {
    expect(query('')).toBe('');
  });
});

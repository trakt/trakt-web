import { describe, expect, it } from 'vitest';
import { toPersistedQueryName } from './toPersistedQueryName.ts';

describe('util: toPersistedQueryName', () => {
  it('should return the query name from a persister storage key', () => {
    expect(
      toPersistedQueryName(
        'tanstack-query-["currentUserHistory","me",{"limit":1000}]',
      ),
    ).toBe('currentUserHistory');
  });

  it('should leave out the query params', () => {
    expect(
      toPersistedQueryName('tanstack-query-["search","my secret search"]'),
    ).toBe('search');
  });

  it('should fall back for keys without a query hash', () => {
    expect(toPersistedQueryName('tanstack-query-')).toBe('unknown');
  });

  it('should fall back for a malformed hash', () => {
    expect(toPersistedQueryName('tanstack-query-["broken')).toBe('unknown');
  });
});

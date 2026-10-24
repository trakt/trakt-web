import type { QueryObserverResult } from '@tanstack/query-core';
import { describe, expect, it } from 'vitest';
import { toLoadableData } from './toLoadableData.ts';

const toQuery = (query: { isLoading: boolean; data?: string }) =>
  query as QueryObserverResult<string | Nil>;

describe('toLoadableData', () => {
  it('should be null when signed out', () => {
    const query = toQuery({ isLoading: true, data: 'data' });

    expect(toLoadableData({ isAuthorized: false, query })).toBeNull();
  });

  it('should be undefined while the query loads', () => {
    const query = toQuery({ isLoading: true, data: undefined });

    expect(toLoadableData({ isAuthorized: true, query })).toBeUndefined();
  });

  it('should be the data once loaded', () => {
    const query = toQuery({ isLoading: false, data: 'data' });

    expect(toLoadableData({ isAuthorized: true, query })).toBe('data');
  });

  it('should be null when the loaded query has no data', () => {
    const query = toQuery({ isLoading: false, data: undefined });

    expect(toLoadableData({ isAuthorized: true, query })).toBeNull();
  });
});

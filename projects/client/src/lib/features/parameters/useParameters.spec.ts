import { renderStore } from '$test/beds/store/renderStore.ts';
import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';
import { useParameters } from './useParameters.ts';

describe('useParameters', () => {
  it('should initialize with empty parameters', async () => {
    const { search } = await renderStore(() => useParameters());
    const params = get(search);

    expect(params).toBeInstanceOf(URLSearchParams);
    expect(Array.from(params.entries())).toEqual([]);
  });

  it('should update parameters correctly', async () => {
    const { search, update } = await renderStore(() => useParameters());

    update({ 'foo': 'bar' });
    expect(get(search).get('foo')).toBe('bar');

    update({ 'num': 42 });
    expect(get(search).get('num')).toBe('42');
  });
});

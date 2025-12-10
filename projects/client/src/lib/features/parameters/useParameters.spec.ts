import { renderStore } from '$test/beds/store/renderStore.ts';
// get removed - use .value or firstValueFrom
import { describe, expect, it } from 'vitest';
import { useParameters } from './useParameters.ts';

describe('useParameters', () => {
  it('should initialize with empty parameters', async () => {
    const { search } = await renderStore(() => useParameters());
    const params = search.value;

    expect(params).toBeInstanceOf(URLSearchParams);
    expect(Array.from(params.entries())).toEqual([]);
  });

  it('should update parameters correctly', async () => {
    const { search, update } = await renderStore(() => useParameters());

    update({ 'foo': 'bar' });
    expect(search.value.'foo'.value).toBe('bar');

    update({ 'num': 42 });
    expect(search.value.'num'.value).toBe('42');
  });
});

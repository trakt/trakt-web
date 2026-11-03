import { createStateWriter } from '$test/beds/svelte/createStateWriter.svelte.ts';
import { runInDerived } from '$test/beds/svelte/runInDerived.svelte.ts';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useSeasonalTheme } from './useSeasonalTheme.ts';

describe('useSeasonalTheme', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    document.documentElement.removeAttribute('data-seasonal-theme');
  });

  it('should not trip state_unsafe_mutation when the theme resolves inside a $derived', () => {
    const pending: Array<() => void> = [];
    vi.stubGlobal('queueMicrotask', (task: () => void) => pending.push(task));
    document.documentElement.setAttribute('data-seasonal-theme', 'halloween');

    const writer = createStateWriter();
    const subscription = useSeasonalTheme().activeTheme.subscribe(() =>
      writer.write(),
    );

    const resolveTheme = () =>
      runInDerived(() => {
        pending.splice(0).forEach((task) => task());
        return true;
      })();

    expect(resolveTheme).not.toThrow();
    expect(writer.writes).toBe(2);
    subscription.unsubscribe();
  });
});

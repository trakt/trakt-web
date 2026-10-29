import { resetGlobalStore } from '$lib/components/toggles/useToggler.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { waitForValue } from '$test/readable/waitForValue.ts';
import { beforeEach, describe, expect, it } from 'vitest';
import { useRecommendationMode } from './useRecommendationMode.ts';

describe('store: useRecommendationMode', () => {
  beforeEach(() => {
    localStorage.clear();
    resetGlobalStore();
    setAuthorization(true);
  });

  it('should request smart by default', async () => {
    const { requestMode } = await renderStore(() => useRecommendationMode());

    expect(await waitForValue(requestMode, 'smart')).toBe('smart');
  });

  it('should request classic after switching to it', async () => {
    const { requestMode, onModeChange } = await renderStore(() =>
      useRecommendationMode(),
    );
    onModeChange('classic');

    expect(await waitForValue(requestMode, 'classic')).toBe('classic');
  });
});

import { firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const APPEARANCE_STORAGE_KEY = 'trakt_appearance';

async function loadAppearance() {
  const { useAppearance } = await import('./useAppearance.ts');
  return useAppearance();
}

describe('store: useAppearance', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('should disable all appearance preferences by default', async () => {
    const appearance = await loadAppearance();

    await expect(firstValueFrom(appearance.reduceVisualNoise)).resolves
      .toBe(false);
    await expect(firstValueFrom(appearance.reduceWidth)).resolves.toBe(false);
    await expect(firstValueFrom(appearance.centerDrawers)).resolves.toBe(false);
  });

  it('should restore valid appearance preferences from storage', async () => {
    localStorage.setItem(
      APPEARANCE_STORAGE_KEY,
      JSON.stringify({
        reduceVisualNoise: true,
        reduceWidth: true,
        centerDrawers: true,
      }),
    );

    const appearance = await loadAppearance();

    await expect(firstValueFrom(appearance.reduceVisualNoise)).resolves
      .toBe(true);
    await expect(firstValueFrom(appearance.reduceWidth)).resolves.toBe(true);
    await expect(firstValueFrom(appearance.centerDrawers)).resolves.toBe(true);
  });

  it('should ignore malformed appearance preferences', async () => {
    localStorage.setItem(APPEARANCE_STORAGE_KEY, '{not valid json}');

    const appearance = await loadAppearance();

    await expect(firstValueFrom(appearance.reduceVisualNoise)).resolves
      .toBe(false);
    await expect(firstValueFrom(appearance.reduceWidth)).resolves.toBe(false);
    await expect(firstValueFrom(appearance.centerDrawers)).resolves.toBe(false);
  });

  it('should publish and persist appearance preference changes', async () => {
    const appearance = await loadAppearance();

    appearance.setReduceVisualNoise(true);
    appearance.setReduceWidth(true);
    appearance.setCenterDrawers(true);

    await expect(firstValueFrom(appearance.reduceVisualNoise)).resolves
      .toBe(true);
    await expect(firstValueFrom(appearance.reduceWidth)).resolves.toBe(true);
    await expect(firstValueFrom(appearance.centerDrawers)).resolves.toBe(true);
    expect(JSON.parse(localStorage.getItem(APPEARANCE_STORAGE_KEY) ?? '{}'))
      .toEqual({
        reduceVisualNoise: true,
        reduceWidth: true,
        centerDrawers: true,
      });
  });

  it('should migrate the background image preference', async () => {
    localStorage.setItem(
      APPEARANCE_STORAGE_KEY,
      JSON.stringify({ reduceBackgroundImages: true }),
    );

    const appearance = await loadAppearance();

    await expect(firstValueFrom(appearance.reduceVisualNoise)).resolves
      .toBe(true);
  });
});

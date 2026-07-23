import AppearanceSettingSync from './AppearanceSettingSync.svelte';

import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { flushSync, tick } from 'svelte';
import { beforeEach, describe, expect, it } from 'vitest';
import { useAppearance } from './useAppearance.ts';

describe('AppearanceSettingSync', () => {
  beforeEach(() => {
    const appearance = useAppearance();
    appearance.setReduceVisualNoise(false);
    appearance.setReduceWidth(false);
    appearance.setCenterDrawers(false);
    document.documentElement.removeAttribute('data-reduced-visual-noise');
    document.documentElement.removeAttribute('data-reduced-width');
    document.documentElement.removeAttribute('data-centered-drawers');
  });

  it('should update appearance attributes live and clean them up', async () => {
    const rendered = renderComponent(AppearanceSettingSync, { props: {} });
    const appearance = useAppearance();
    const root = document.documentElement;

    await tick();

    flushSync(() => {
      appearance.setReduceVisualNoise(true);
      appearance.setReduceWidth(true);
      appearance.setCenterDrawers(true);
    });

    expect(root).toHaveAttribute('data-reduced-visual-noise');
    expect(root).toHaveAttribute('data-reduced-width');
    expect(root).toHaveAttribute('data-centered-drawers');

    flushSync(() => {
      appearance.setReduceVisualNoise(false);
      appearance.setReduceWidth(false);
      appearance.setCenterDrawers(false);
    });

    expect(root).not.toHaveAttribute('data-reduced-visual-noise');
    expect(root).not.toHaveAttribute('data-reduced-width');
    expect(root).not.toHaveAttribute('data-centered-drawers');

    rendered.unmount();

    expect(root).not.toHaveAttribute('data-reduced-visual-noise');
    expect(root).not.toHaveAttribute('data-reduced-width');
    expect(root).not.toHaveAttribute('data-centered-drawers');
  });
});

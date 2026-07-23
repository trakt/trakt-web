import Drawer from './Drawer.svelte';

import { PORTAL_UNDERLAY_ID } from '$lib/features/portal/_internal/constants.ts';
import { useAppearance } from '$lib/features/appearance/useAppearance.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { waitFor } from '@testing-library/svelte';
import { createRawSnippet, flushSync } from 'svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('Drawer', () => {
  beforeEach(() => {
    useAppearance().setCenterDrawers(false);
  });

  it('should update an open drawer when centered appearance changes', async () => {
    const onClose = vi.fn();
    renderComponent(Drawer, {
      props: {
        children: createRawSnippet(() => ({
          render: () => '<input aria-label="Drawer state" value="Preserved" />',
        })),
        onClose,
      },
    });

    const drawer = await waitFor(() => {
      const element = document.querySelector('.trakt-drawer');
      expect(element).toBeInstanceOf(HTMLElement);
      return element as HTMLElement;
    });
    const underlay = await waitFor(() => {
      const element = document.getElementById(PORTAL_UNDERLAY_ID);
      expect(element).toBeInstanceOf(HTMLDivElement);
      return element as HTMLDivElement;
    });

    expect(drawer).not.toHaveClass('is-centered');

    const drawerContent = drawer.querySelector('.trakt-drawer-content');
    const statefulChild = drawer.querySelector<HTMLInputElement>(
      '[aria-label="Drawer state"]',
    );
    expect(drawerContent).toBeInstanceOf(HTMLElement);
    expect(statefulChild).toBeInstanceOf(HTMLInputElement);
    statefulChild?.focus();
    (drawerContent as HTMLElement).scrollTop = 48;

    flushSync(() => {
      useAppearance().setCenterDrawers(true);
    });

    expect(document.querySelector('.trakt-drawer')).toBe(drawer);
    expect(document.getElementById(PORTAL_UNDERLAY_ID)).toBe(underlay);
    expect(drawer).toHaveClass('is-centered');
    expect(underlay).toHaveAttribute(
      'data-appearance',
      'translucent',
    );
    expect(
      drawer.querySelector('[aria-label="Drawer state"]'),
    ).toBe(statefulChild);
    expect(statefulChild).toHaveValue('Preserved');
    expect(document.activeElement).toBe(statefulChild);
    expect((drawerContent as HTMLElement).scrollTop).toBe(48);

    flushSync(() => {
      useAppearance().setCenterDrawers(false);
    });

    expect(document.querySelector('.trakt-drawer')).toBe(drawer);
    expect(document.getElementById(PORTAL_UNDERLAY_ID)).toBe(underlay);
    expect(drawer).not.toHaveClass('is-centered');
    expect(underlay).not.toHaveAttribute(
      'data-appearance',
    );
    expect(
      drawer.querySelector('[aria-label="Drawer state"]'),
    ).toBe(statefulChild);
    expect(statefulChild).toHaveValue('Preserved');
    expect(document.activeElement).toBe(statefulChild);
    expect((drawerContent as HTMLElement).scrollTop).toBe(48);

    underlay.click();
    expect(onClose).toHaveBeenCalledOnce();
  });
});

import { PORTAL_UNDERLAY_ID } from '$lib/features/portal/_internal/constants.ts';
import { afterEach, describe, expect, it, vi } from 'vitest';

const lifecycle = vi.hoisted(() => ({
  cleanup: undefined as (() => void) | undefined,
  afterNavigate: undefined as
    | ((navigation: { to?: { route: { id: string } } }) => void)
    | undefined,
}));

vi.mock('svelte', () => ({
  onMount: (callback: () => void | (() => void)) => {
    const cleanup = callback();
    lifecycle.cleanup = typeof cleanup === 'function' ? cleanup : undefined;
  },
}));

vi.mock('$app/navigation', () => ({
  afterNavigate: (
    callback: (navigation: { to?: { route: { id: string } } }) => void,
  ) => {
    lifecycle.afterNavigate = callback;
  },
}));

vi.mock('$app/state', () => ({
  page: { route: { id: '/current' } },
}));

import { useDrawerPortal } from './useDrawerPortal.ts';

afterEach(() => {
  lifecycle.cleanup?.();
  lifecycle.cleanup = undefined;
  lifecycle.afterNavigate = undefined;
  document.body.replaceChildren();
});

describe('useDrawerPortal', () => {
  it('should update the auto-close underlay when centered state changes', () => {
    const onClose = vi.fn();
    const drawer = document.createElement('div');
    document.body.appendChild(drawer);

    const { portal } = useDrawerPortal({
      getHasAutoClose: () => true,
      getOnClose: () => onClose,
      getElevated: () => false,
    });
    const action = portal(drawer, false);

    const underlay = document.getElementById(PORTAL_UNDERLAY_ID);
    expect(underlay).toBeInstanceOf(HTMLDivElement);
    expect(underlay).not.toHaveAttribute('data-appearance');

    action.update(true);
    expect(underlay).toHaveAttribute('data-appearance', 'translucent');

    action.update(false);
    expect(underlay).not.toHaveAttribute('data-appearance');

    underlay?.click();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('should create and remove a non-closing underlay for centered state', () => {
    const onClose = vi.fn();
    const originContainer = document.createElement('div');
    const drawer = document.createElement('div');
    const statefulChild = document.createElement('input');
    statefulChild.value = 'Preserved';
    drawer.appendChild(statefulChild);
    originContainer.appendChild(drawer);
    document.body.appendChild(originContainer);

    const { portal } = useDrawerPortal({
      getHasAutoClose: () => false,
      getOnClose: () => onClose,
      getElevated: () => false,
    });
    const action = portal(drawer, false);

    expect(document.getElementById(PORTAL_UNDERLAY_ID)).toBeNull();
    expect(drawer.parentElement).toBe(document.body);
    drawer.scrollTop = 48;
    statefulChild.focus();

    action.update(true);
    const underlay = document.getElementById(PORTAL_UNDERLAY_ID);
    expect(underlay).toHaveAttribute('data-appearance', 'translucent');
    expect(drawer.parentElement).toBe(document.body);
    expect(drawer.scrollTop).toBe(48);
    expect(document.activeElement).toBe(statefulChild);
    expect(statefulChild).toHaveValue('Preserved');

    underlay?.click();
    expect(onClose).not.toHaveBeenCalled();

    action.update(false);
    expect(document.getElementById(PORTAL_UNDERLAY_ID)).toBeNull();
    expect(drawer.parentElement).toBe(document.body);
    expect(drawer.scrollTop).toBe(48);
    expect(document.activeElement).toBe(statefulChild);
    expect(statefulChild).toHaveValue('Preserved');

    action.update(true);
    expect(document.getElementById(PORTAL_UNDERLAY_ID)).toHaveAttribute(
      'data-appearance',
      'translucent',
    );
    expect(drawer.parentElement).toBe(document.body);
  });

  it('should only auto-close after leaving the drawer route', () => {
    const onClose = vi.fn();
    const drawer = document.createElement('div');
    document.body.appendChild(drawer);

    const { portal } = useDrawerPortal({
      getHasAutoClose: () => true,
      getOnClose: () => onClose,
      getElevated: () => false,
    });
    portal(drawer, false);

    lifecycle.afterNavigate?.({ to: { route: { id: '/current' } } });
    expect(onClose).not.toHaveBeenCalled();

    lifecycle.afterNavigate?.({ to: { route: { id: '/next' } } });
    expect(onClose).toHaveBeenCalledOnce();
  });
});

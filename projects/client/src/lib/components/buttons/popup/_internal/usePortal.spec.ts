import { usePortal } from '$lib/components/buttons/popup/_internal/usePortal.ts';
import { renderStore } from '$test/beds/store/renderStore.ts';
import { get } from 'svelte/store';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('action: usePortal', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame'] });
  });

  it('should move the node to the body', async () => {
    const targetNode = document.createElement('div');
    const popupNode = document.createElement('div');

    targetNode.appendChild(popupNode);

    const { portalTrigger, portal } = usePortal();
    expect(document.body.contains(popupNode)).toBe(false);

    await renderStore(() => portalTrigger(targetNode));
    targetNode.dispatchEvent(new Event('click'));
    await renderStore(() => portal(popupNode));

    expect(document.body.contains(popupNode)).toBe(true);
  });

  it('should not move the node to the body if the popup is not open', async () => {
    const targetNode = document.createElement('div');
    const popupNode = document.createElement('div');

    targetNode.appendChild(popupNode);

    const { portalTrigger, portal } = usePortal();

    await renderStore(() => portalTrigger(targetNode));
    await renderStore(() => portal(popupNode));

    expect(document.body.contains(popupNode)).toBe(false);
  });

  it('should close the popup on a resize', async () => {
    const targetNode = document.createElement('div');
    const popupNode = document.createElement('div');

    targetNode.appendChild(popupNode);

    const { portalTrigger, portal, isOpened } = usePortal();

    await renderStore(() => portalTrigger(targetNode));
    targetNode.dispatchEvent(new Event('click'));
    await renderStore(() => portal(popupNode));

    globalThis.window.dispatchEvent(new Event('resize'));

    vi.advanceTimersToNextFrame();

    expect(get(isOpened)).toBe(false);
  });

  it('should remove the popup if the target is removed', async () => {
    const targetNode = document.createElement('div');
    const popupNode = document.createElement('div');

    targetNode.appendChild(popupNode);

    const { portalTrigger, portal } = usePortal();

    const component = await renderStore(() => portalTrigger(targetNode));
    targetNode.dispatchEvent(new Event('click'));
    await renderStore(() => portal(popupNode));

    component.destroy();
    expect(document.body.contains(popupNode)).toBe(false);
  });
});

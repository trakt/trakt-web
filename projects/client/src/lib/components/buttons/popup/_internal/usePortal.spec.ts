import { PORTAL_UNDERLAY_ID } from '$lib/components/buttons/popup/_internal/constants.ts';
import { usePortal } from '$lib/components/buttons/popup/_internal/usePortal.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
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

    const component = await renderStore(() => portalTrigger(targetNode));
    targetNode.dispatchEvent(new Event('click'));
    await renderStore(() => portal(popupNode));

    vi.advanceTimersToNextFrame();

    expect(document.body.contains(popupNode)).toBe(true);
    component.destroy();
  });

  it('should add a single underlay', async () => {
    const targetNode = document.createElement('div');
    const popupNode = document.createElement('div');

    targetNode.appendChild(popupNode);

    const { portalTrigger } = usePortal();

    const component = await renderStore(() => portalTrigger(targetNode));
    targetNode.dispatchEvent(new Event('click'));

    const underlays = document.querySelectorAll(`#${PORTAL_UNDERLAY_ID}`);
    expect(underlays).toHaveLength(1);
    const underlay = assertDefined(underlays[0]);
    expect(document.body.contains(underlay)).toBe(true);

    component.destroy();
  });

  it('should not move the node to the body if the popup is not open', async () => {
    const targetNode = document.createElement('div');
    const popupNode = document.createElement('div');

    targetNode.appendChild(popupNode);

    const { portalTrigger, portal } = usePortal();

    const component = await renderStore(() => portalTrigger(targetNode));
    await renderStore(() => portal(popupNode));

    vi.advanceTimersToNextFrame();

    expect(document.body.contains(popupNode)).toBe(false);
    component.destroy();
  });

  it('should close the popup on a resize', async () => {
    const targetNode = document.createElement('div');
    const popupNode = document.createElement('div');

    targetNode.appendChild(popupNode);

    const { portalTrigger, isOpened } = usePortal();

    const component = await renderStore(() => portalTrigger(targetNode));
    targetNode.dispatchEvent(new Event('click'));

    globalThis.window.dispatchEvent(new Event('resize'));

    vi.advanceTimersToNextFrame();

    expect(get(isOpened)).toBe(false);
    component.destroy();
  });

  it('should remove the popup if the target is removed', async () => {
    const targetNode = document.createElement('div');
    const popupNode = document.createElement('div');

    targetNode.appendChild(popupNode);

    const { portalTrigger, portal } = usePortal();

    const component = await renderStore(() => portalTrigger(targetNode));
    targetNode.dispatchEvent(new Event('click'));
    await renderStore(() => portal(popupNode));

    vi.advanceTimersToNextFrame();

    component.destroy();
    expect(document.body.contains(popupNode)).toBe(false);
  });

  it('should remove the underlay', async () => {
    const targetNode = document.createElement('div');
    const popupNode = document.createElement('div');

    targetNode.appendChild(popupNode);

    const { portalTrigger } = usePortal();

    const component = await renderStore(() => portalTrigger(targetNode));
    targetNode.dispatchEvent(new Event('click'));

    component.destroy();

    const underlay = document.querySelector(`#${PORTAL_UNDERLAY_ID}`);
    expect(underlay).toBeNull();
  });
});

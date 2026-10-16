import { renderStore } from '$test/beds/store/renderStore.ts';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  POPUP_ALIGNMENT_ATTRIBUTE,
  POPUP_POSITION_ATTRIBUTE,
} from './constants.ts';
import { forceOnScreen } from './forceOnScreen.ts';
import { openPopupContainer } from './openPopupContainer.ts';

describe('action: usePortal', () => {
  const popupWidth = 110;
  const popupRect = {
    left: -10,
    right: 100,
    width: popupWidth,
    top: 0,
    bottom: 0,
    x: 0,
    y: 0,
    height: 0,
    toJSON: () => {},
  };

  beforeEach(() => {
    vi.useFakeTimers({
      toFake: ['requestAnimationFrame', 'cancelAnimationFrame'],
    });

    Object.defineProperty(window, 'innerWidth', {
      value: popupWidth - 20,
      configurable: true,
    });
  });

  it('should set the position attributes', async () => {
    const targetNode = document.createElement('div');
    const popupNode = document.createElement('div');
    popupNode.getBoundingClientRect = () => popupRect;

    const component = await renderStore(() =>
      openPopupContainer(popupNode, targetNode, { position: 'right' })
    );

    forceOnScreen(popupNode, targetNode, 'left');
    expect(targetNode.getAttribute(POPUP_POSITION_ATTRIBUTE)).toEqual('left');
    expect(targetNode.getAttribute(POPUP_ALIGNMENT_ATTRIBUTE)).toEqual(
      'unaligned',
    );

    component.destroy();
  });

  it('should reset the position attributes', async () => {
    const targetNode = document.createElement('div');
    const popupNode = document.createElement('div');
    popupNode.getBoundingClientRect = () => popupRect;

    const component = await renderStore(() =>
      openPopupContainer(popupNode, targetNode, { position: 'right' })
    );

    forceOnScreen(popupNode, targetNode, 'left');
    component.destroy();

    expect(targetNode.getAttribute(POPUP_POSITION_ATTRIBUTE)).toBeNull();
    expect(targetNode.getAttribute(POPUP_ALIGNMENT_ATTRIBUTE)).toBeNull();
  });

  it('should realign once per frame when the popup content changes', async () => {
    const targetNode = document.createElement('div');
    const popupNode = document.createElement('div');
    const getBoundingClientRect = vi.fn(() => popupRect);
    popupNode.getBoundingClientRect = getBoundingClientRect;

    const component = await renderStore(() =>
      openPopupContainer(popupNode, targetNode, { position: 'right' })
    );

    vi.advanceTimersByTime(16);
    getBoundingClientRect.mockClear();

    popupNode.appendChild(document.createElement('span'));
    await Promise.resolve();

    expect(getBoundingClientRect).not.toHaveBeenCalled();

    vi.advanceTimersByTime(16);
    const readsPerRealign = getBoundingClientRect.mock.calls.length;
    getBoundingClientRect.mockClear();

    popupNode.appendChild(document.createElement('span'));
    await Promise.resolve();
    popupNode.appendChild(document.createElement('span'));
    await Promise.resolve();
    vi.advanceTimersByTime(16);

    expect(readsPerRealign).toBeGreaterThan(0);
    expect(getBoundingClientRect).toHaveBeenCalledTimes(readsPerRealign);

    component.destroy();
  });

  it('should not realign after it is destroyed', async () => {
    const targetNode = document.createElement('div');
    const popupNode = document.createElement('div');
    const getBoundingClientRect = vi.fn(() => popupRect);
    popupNode.getBoundingClientRect = getBoundingClientRect;

    const component = await renderStore(() =>
      openPopupContainer(popupNode, targetNode, { position: 'right' })
    );

    vi.advanceTimersByTime(16);
    getBoundingClientRect.mockClear();

    popupNode.appendChild(document.createElement('span'));
    await Promise.resolve();
    component.destroy();
    vi.advanceTimersByTime(16);

    expect(getBoundingClientRect).not.toHaveBeenCalled();
  });
});

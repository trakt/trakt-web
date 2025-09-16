import { renderStore } from '$test/beds/store/renderStore.ts';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  POPUP_ALIGNMENT_ATTRIBUTE,
  POPUP_POSITION_ATTRIBUTE,
} from './constants.ts';
import { forceOnScreen } from './forceOnScreen.ts';
import { openPopupContainer } from './openPopupContainer.ts';

describe('action: usePortal', () => {
  const POPUP_WIDTH = 110;
  const POPUP_RECT = {
    left: -10,
    right: 100,
    width: POPUP_WIDTH,
    top: 0,
    bottom: 0,
    x: 0,
    y: 0,
    height: 0,
    toJSON: () => {},
  };

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame'] });

    Object.defineProperty(window, 'innerWidth', {
      value: POPUP_WIDTH - 20,
      configurable: true,
    });
  });

  it('should set the position attributes', async () => {
    const targetNode = document.createElement('div');
    const popupNode = document.createElement('div');
    popupNode.getBoundingClientRect = () => POPUP_RECT;

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
    popupNode.getBoundingClientRect = () => POPUP_RECT;

    const component = await renderStore(() =>
      openPopupContainer(popupNode, targetNode, { position: 'right' })
    );

    forceOnScreen(popupNode, targetNode, 'left');
    component.destroy();

    expect(targetNode.getAttribute(POPUP_POSITION_ATTRIBUTE)).toBeNull();
    expect(targetNode.getAttribute(POPUP_ALIGNMENT_ATTRIBUTE)).toBeNull();
  });
});

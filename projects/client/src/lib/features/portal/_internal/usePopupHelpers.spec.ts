import { beforeEach, describe, expect, it, vi } from 'vitest';
import { POPUP_CLONE_ATTRIBUTE } from './constants.ts';
import type { PopupPlacement } from './models/PopupPlacement.ts';
import { usePopupHelpers } from './usePopupHelpers.ts';

describe('usePopupHelpers', () => {
  let target: HTMLElement;

  const placement: PopupPlacement = {
    position: 'top',
    mode: 'contain',
  };

  beforeEach(() => {
    target = document.createElement('div');
    vi.spyOn(document.body, 'appendChild');
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
      left: 100,
      top: 200,
      right: 0,
      bottom: 0,
      width: 20,
      height: 10,
      x: 0,
      y: 0,
      toJSON: () => {},
    });
  });

  const getTargetClone = () => {
    const popupClones = Array.from(
      document.querySelectorAll(`[${POPUP_CLONE_ATTRIBUTE}]`),
    );

    if (popupClones.length === 0) {
      return null;
    }

    return popupClones.at(0) as HTMLElement;
  };

  it('should initialize with null values', () => {
    usePopupHelpers();

    expect(getTargetClone()).toBeNull();
  });

  it('should create a clone of the popup target', () => {
    const { addHelpers, removeHelpers } = usePopupHelpers(placement);
    addHelpers(target);

    const clone = getTargetClone();

    expect(clone).not.toBeNull();
    expect(clone?.getAttribute('data-popup-state')).toBe('opened');
    expect(clone?.style.zIndex).toBe('calc(var(--layer-menu) + 1)');
    expect(clone?.style.width).toBe('20px');
    expect(clone?.style.height).toBe('10px');
    expect(clone?.style.boxSizing).toBe('border-box');
    expect(document.body.appendChild).toHaveBeenCalled();

    removeHelpers(null);
  });

  it('should remove clone when removing helpers', () => {
    const { addHelpers, removeHelpers } = usePopupHelpers(placement);

    addHelpers(target);
    removeHelpers(null);

    expect(getTargetClone()).toBeNull();
  });

  it('should clean up helpers when in an open dialog', () => {
    const dialog = document.createElement('dialog');
    dialog.setAttribute('open', '');
    document.body.appendChild(dialog);

    const { addHelpers, removeHelpers } = usePopupHelpers(placement);

    addHelpers(target);
    removeHelpers(null);

    expect(getTargetClone()).toBeNull();

    dialog.remove();
  });

  it('should have only one clone', () => {
    const { addHelpers, removeHelpers } = usePopupHelpers(placement);
    addHelpers(target);

    const popupClones = Array.from(
      document.querySelectorAll(`[${POPUP_CLONE_ATTRIBUTE}]`),
    );

    expect(popupClones).toHaveLength(1);

    removeHelpers(null);
  });

  it('should not add a clone if not needed', () => {
    const { addHelpers, removeHelpers } = usePopupHelpers();
    addHelpers(target);

    expect(getTargetClone()).toBeNull();

    removeHelpers(null);
  });
});

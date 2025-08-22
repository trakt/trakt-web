import { beforeEach, describe, expect, it } from 'vitest';
import { setPositionAttributes } from './setPositionAttributes.ts';

describe('setPositionAttributes', () => {
  let popupContainer: HTMLElement;
  let targetNode: HTMLElement;

  beforeEach(() => {
    popupContainer = document.createElement('div');
    targetNode = document.createElement('div');
  });

  it('should set the position attributes on both elements ', () => {
    setPositionAttributes({ popupContainer, targetNode, position: 'top' });

    expect(popupContainer).toHaveAttribute('data-popup-position', 'top');
    expect(targetNode).toHaveAttribute('data-popup-position', 'top');

    expect(popupContainer).toHaveAttribute('data-popup-alignment', 'aligned');
    expect(targetNode).toHaveAttribute('data-popup-alignment', 'aligned');
  });
});

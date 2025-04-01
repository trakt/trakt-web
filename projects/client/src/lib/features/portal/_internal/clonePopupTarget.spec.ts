import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clonePopupTarget } from './clonePopupTarget.ts';

describe('clonePopupTarget', () => {
  beforeEach(() => {
    vi.stubGlobal('window', { scrollX: 10, scrollY: 20 });
  });

  it('should clone target element with correct position', () => {
    const target = document.createElement('div');
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
      left: 100,
      top: 200,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    const clone = clonePopupTarget(target);

    expect(clone.style.position).toBe('absolute');
    expect(clone.style.left).toBe('110px');
    expect(clone.style.top).toBe('220px');
  });

  it('should set correct data attribute and z-index', () => {
    const target = document.createElement('div');
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    const clone = clonePopupTarget(target);

    expect(clone.getAttribute('data-popup-state')).toBe('opened');
    expect(clone.style.zIndex).toBe('calc(var(--layer-menu) + 1)');
  });

  it('should clone all child nodes', () => {
    const target = document.createElement('div');
    target.innerHTML = '<span>Test</span>';
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    const clone = clonePopupTarget(target);

    expect(clone.innerHTML).toBe(target.innerHTML);
  });
});

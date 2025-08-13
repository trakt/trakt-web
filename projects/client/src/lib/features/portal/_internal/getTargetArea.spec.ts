import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getTargetArea } from './getTargetArea.ts';

describe('getTargetArea', () => {
  beforeEach(() => {
    document.body.innerHTML = '';

    Object.defineProperty(globalThis.window, 'scrollX', {
      writable: true,
      configurable: true,
      value: 0,
    });

    Object.defineProperty(globalThis.window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    });

    Object.defineProperty(document.documentElement, 'clientWidth', {
      writable: true,
      configurable: true,
      value: 1920,
    });

    Object.defineProperty(document.documentElement, 'clientHeight', {
      writable: true,
      configurable: true,
      value: 1080,
    });
  });

  it('should return document viewport when no dialog is open', () => {
    const result = getTargetArea();

    expect(result.viewport).toEqual({
      left: 0,
      top: 0,
      width: 1920,
      height: 1080,
    });
    expect(result.target).toBe(document.body);
  });

  it('should return document viewport with scroll offset', () => {
    Object.defineProperty(globalThis.window, 'scrollX', {
      value: 100,
    });
    Object.defineProperty(globalThis.window, 'scrollY', {
      value: 200,
    });

    const result = getTargetArea();

    expect(result.viewport).toEqual({
      left: 100,
      top: 200,
      width: 1920,
      height: 1080,
    });
    expect(result.target).toBe(document.body);
  });

  it('should return dialog viewport when dialog is open', () => {
    const dialog = document.createElement('dialog');
    dialog.setAttribute('open', '');
    document.body.appendChild(dialog);

    const dialogRect = {
      left: 50,
      top: 100,
      width: 800,
      height: 600,
      x: 50,
      y: 100,
      right: 850,
      bottom: 700,
      toJSON: () => {},
    };

    vi.spyOn(dialog, 'getBoundingClientRect').mockReturnValue(dialogRect);

    const result = getTargetArea();

    expect(result.viewport).toEqual({
      left: 50,
      top: 100,
      width: 800,
      height: 600,
    });
    expect(result.target).toBe(dialog);
  });

  it('should ignore dialog without open attribute', () => {
    const dialog = document.createElement('dialog');
    document.body.appendChild(dialog);

    const result = getTargetArea();

    expect(result.viewport).toEqual({
      left: 0,
      top: 0,
      width: 1920,
      height: 1080,
    });
    expect(result.target).toBe(document.body);
  });
});

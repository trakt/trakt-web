import { beforeEach, describe, expect, it, vi } from 'vitest';
import { autoResizeArea } from './autoResizeArea.ts';

describe('action: useDynamicTextArea', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame'] });
  });

  it('should increase rows when content overflows', () => {
    const textArea = document.createElement('textarea');
    const action = autoResizeArea(textArea);

    textArea.rows = 1;

    Object.defineProperty(textArea, 'scrollHeight', { value: 100 });
    Object.defineProperty(textArea, 'clientHeight', { value: 50 });

    textArea.dispatchEvent(new Event('input'));

    vi.advanceTimersToNextFrame();

    expect(textArea.rows).toBe(2);
    action.destroy();
  });

  it('should not exceed maximum rows', () => {
    const textArea = document.createElement('textarea');
    const action = autoResizeArea(textArea);

    textArea.rows = 5;

    Object.defineProperty(textArea, 'scrollHeight', { value: 100 });
    Object.defineProperty(textArea, 'clientHeight', { value: 50 });

    textArea.dispatchEvent(new Event('input'));

    vi.advanceTimersToNextFrame();

    expect(textArea.rows).toBe(5);
    action.destroy();
  });

  it('should decrease rows when content fits', () => {
    const textArea = document.createElement('textarea');
    const action = autoResizeArea(textArea);

    textArea.rows = 3;

    Object.defineProperty(textArea, 'scrollHeight', { value: 50 });
    Object.defineProperty(textArea, 'clientHeight', { value: 100 });

    textArea.dispatchEvent(new Event('input'));

    vi.advanceTimersToNextFrame();

    expect(textArea.rows).toBe(1);
    action.destroy();
  });
});

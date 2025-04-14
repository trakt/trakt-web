import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { focusAndScrollIntoView } from './focusAndScrollIntoView.ts';

describe('focusAndScrollIntoView', () => {
  let mockElement: HTMLButtonElement;

  beforeEach(() => {
    mockElement = document.createElement('button');
    mockElement.focus = vi.fn();
    mockElement.scrollIntoView = vi.fn();

    document.body.appendChild(mockElement);
  });

  afterEach(() => {
    vi.resetAllMocks();
    document.body.innerHTML = '';
  });

  it('should focus and scroll to the element when valid HTMLElement is provided', () => {
    focusAndScrollIntoView(mockElement);

    expect(mockElement.focus).toHaveBeenCalledTimes(1);
    expect(mockElement.scrollIntoView).toHaveBeenCalledTimes(1);
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
      block: 'center',
      inline: 'center',
    });
  });

  it('should do nothing when null is provided', () => {
    focusAndScrollIntoView(null);

    expect(mockElement.focus).not.toHaveBeenCalled();
    expect(mockElement.scrollIntoView).not.toHaveBeenCalled();
  });
});

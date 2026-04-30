import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { scrollActiveCommentIntoView } from './scrollActiveCommentIntoView.ts';

function createMockElement(
  { offsetTop = 0, scrollTop = 0, className = '' } = {},
) {
  return {
    offsetTop,
    scrollTop,
    className,
    closest: vi.fn(),
  } as unknown as HTMLElement;
}

describe('action: scrollActiveCommentIntoView', () => {
  let container: HTMLElement;
  let target: HTMLElement;

  beforeEach(() => {
    container = createMockElement({ scrollTop: 100, className: 'container' });
    target = createMockElement({ offsetTop: 200 });
    target.closest = vi.fn().mockReturnValue(container);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns undefined if container is not found', () => {
    target.closest = vi.fn().mockReturnValue(null);
    const result = scrollActiveCommentIntoView(target, 'container');
    expect(result).toBeUndefined();
  });

  it('returns an object with destroy method', () => {
    const result = scrollActiveCommentIntoView(target, 'container');
    expect(result).toHaveProperty('destroy');
    expect(typeof result?.destroy).toBe('function');
  });

  it('calls container.closest with correct selector', () => {
    scrollActiveCommentIntoView(target, 'container');
    expect(target.closest).toHaveBeenCalledWith('.container');
  });

  // FIXME: add test for actual scrolling behavior
});

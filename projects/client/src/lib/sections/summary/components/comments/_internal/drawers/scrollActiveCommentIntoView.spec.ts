import { renderStore } from '$test/beds/store/renderStore.ts';
import { describe, expect, it, vi } from 'vitest';
import { scrollActiveCommentIntoView } from './scrollActiveCommentIntoView.ts';

describe('action: scrollActiveCommentIntoView', () => {
  const node = document.createElement('div');
  Object.defineProperty(node, 'offsetHeight', { value: 100 });

  it('should scroll into view when isActiveComment is true', async () => {
    const scrollIntoViewMock = vi.fn();
    node.scrollIntoView = scrollIntoViewMock;

    await renderStore(() => scrollActiveCommentIntoView(node, true));

    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      behavior: 'smooth',
    });
  });

  it('should not scroll into view when isActiveComment is false', async () => {
    const scrollIntoViewMock = vi.fn();
    node.scrollIntoView = scrollIntoViewMock;

    await renderStore(() => scrollActiveCommentIntoView(node, false));

    expect(scrollIntoViewMock).not.toHaveBeenCalled();
  });

  it('should update scroll position when isActiveComment changes', async () => {
    const scrollIntoViewMock = vi.fn();
    node.scrollIntoView = scrollIntoViewMock;

    const action = await renderStore(() =>
      scrollActiveCommentIntoView(node, false)
    );
    action.update(true);

    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      behavior: 'smooth',
    });
  });
});

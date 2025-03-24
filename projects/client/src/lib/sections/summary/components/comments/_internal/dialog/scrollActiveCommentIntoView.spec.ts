import { scrollActiveCommentIntoView } from '$lib/sections/summary/components/comments/_internal/dialog/scrollActiveCommentIntoView.ts';
import { renderStore } from '$test/beds/store/renderStore.ts';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('action: scrollActiveCommentIntoView', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame'] });
  });

  it('should scroll into view when isActiveComment is true', async () => {
    const node = document.createElement('div');
    const scrollIntoViewMock = vi.fn();
    node.scrollIntoView = scrollIntoViewMock;

    await renderStore(() => scrollActiveCommentIntoView(node, true));

    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      behavior: 'instant',
      inline: 'center',
    });
  });

  it('should not scroll into view when isActiveComment is false', async () => {
    const node = document.createElement('div');
    const scrollIntoViewMock = vi.fn();
    node.scrollIntoView = scrollIntoViewMock;

    await renderStore(() => scrollActiveCommentIntoView(node, false));

    expect(scrollIntoViewMock).not.toHaveBeenCalled();
  });

  it('should update scroll position when isActiveComment changes', async () => {
    const node = document.createElement('div');
    const scrollIntoViewMock = vi.fn();
    node.scrollIntoView = scrollIntoViewMock;

    const action = await renderStore(() =>
      scrollActiveCommentIntoView(node, false)
    );
    action.update(true);

    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      behavior: 'instant',
      inline: 'center',
    });
  });
});

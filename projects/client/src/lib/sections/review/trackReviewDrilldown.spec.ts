import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { trackReviewDrilldown } from './trackReviewDrilldown.ts';

function buildPage(hrefs: ReadonlyArray<string>) {
  const root = document.createElement('div');
  root.addEventListener('click', (event) => event.preventDefault());

  hrefs.forEach((href) => {
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.textContent = href;
    root.append(anchor);
  });

  document.body.append(root);

  return { root, anchors: Array.from(root.querySelectorAll('a')) };
}

describe('action: trackReviewDrilldown', () => {
  const track = vi.fn();

  beforeEach(() => {
    track.mockClear();
  });

  afterEach(() => {
    document.body.replaceChildren();
  });

  it('should track a tap on a title', () => {
    const { root, anchors } = buildPage(['/movies/heretic-2024']);
    trackReviewDrilldown(root, { source: 'yir', track });

    anchors.at(0)?.click();

    expect(track).toHaveBeenCalledExactlyOnceWith({
      source: 'yir',
      type: 'movie',
    });
  });

  it('should track a tap on a nested element of a person link', () => {
    const { root, anchors } = buildPage(['/people/cillian-murphy']);
    const inner = document.createElement('span');
    anchors.at(0)?.append(inner);
    trackReviewDrilldown(root, { source: 'mir', track });

    inner.click();

    expect(track).toHaveBeenCalledExactlyOnceWith({
      source: 'mir',
      type: 'person',
    });
  });

  it('should ignore taps on other navigation', () => {
    const { root, anchors } = buildPage(['/users/me/year/2025']);
    trackReviewDrilldown(root, { source: 'yir', track });

    anchors.at(0)?.click();

    expect(track).not.toHaveBeenCalled();
  });

  it('should stop listening after destroy', () => {
    const { root, anchors } = buildPage(['/shows/silo']);
    const action = trackReviewDrilldown(root, { source: 'yir', track });

    action?.destroy?.();
    anchors.at(0)?.click();

    expect(track).not.toHaveBeenCalled();
  });
});

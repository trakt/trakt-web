import { afterEach, describe, expect, it } from 'vitest';
import { applyTopicPaint } from './applyTopicPaint.ts';
import { TOPIC_PAINT_CACHE_KEY } from './TopicPaintCacheKey.ts';

const paintElements = () =>
  document.head.querySelectorAll('#trakt-topic-paint');

describe('util: applyTopicPaint', () => {
  afterEach(() => applyTopicPaint(null));

  it('should add one style element and cache its css', () => {
    applyTopicPaint('a{}');
    applyTopicPaint('b{}');

    expect(paintElements()).toHaveLength(1);
    expect(paintElements()[0]?.textContent).toBe('b{}');
    expect(localStorage.getItem(TOPIC_PAINT_CACHE_KEY)).toBe('b{}');
  });

  it('should remove the style element and the cache when cleared', () => {
    applyTopicPaint('a{}');
    applyTopicPaint(null);

    expect(paintElements()).toHaveLength(0);
    expect(localStorage.getItem(TOPIC_PAINT_CACHE_KEY)).toBeFalsy();
  });

  it('should leave the style element alone when the css is unchanged', () => {
    applyTopicPaint('a{}');
    const text = paintElements()[0]?.firstChild;
    applyTopicPaint('a{}');

    expect(paintElements()[0]?.firstChild).toBe(text);
  });
});

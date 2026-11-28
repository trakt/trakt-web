import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { TOPIC_CACHE_KEY } from './TopicCacheKey.ts';
import { TOPIC_PAINT_CACHE_KEY } from './TopicPaintCacheKey.ts';
import { topicRegistry } from './topicRegistry.ts';

const firstFrameScript = readFileSync('src/app.html', 'utf8');

describe('topicRegistry', () => {
  it('should list the same topics as the first-frame script in app.html', () => {
    const listed = firstFrameScript.match(/const topics = \[([^\]]*)\]/)?.at(1);
    const topics = listed?.match(/'[^']+'/g)?.map((id) => id.slice(1, -1));

    expect(topics?.toSorted()).toEqual(Object.keys(topicRegistry).toSorted());
  });

  it('should read the same storage keys as the first-frame script in app.html', () => {
    expect(firstFrameScript).toContain(
      `localStorage.getItem('${TOPIC_CACHE_KEY}')`,
    );
    expect(firstFrameScript).toContain(
      `localStorage.getItem('${TOPIC_PAINT_CACHE_KEY}')`,
    );
  });
});

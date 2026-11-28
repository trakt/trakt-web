import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { TOPIC_PAINT_CACHE_KEY } from './TopicPaintCacheKey.ts';

const PAINT_ELEMENT_ID = 'trakt-topic-paint';

function paintElement() {
  const existing = document.getElementById(PAINT_ELEMENT_ID);
  if (existing) return existing;

  const element = document.createElement('style');
  element.id = PAINT_ELEMENT_ID;
  return document.head.appendChild(element);
}

export function applyTopicPaint(css: string | null) {
  if (css === null) {
    document.getElementById(PAINT_ELEMENT_ID)?.remove();
    safeLocalStorage.removeItem(TOPIC_PAINT_CACHE_KEY);
    return;
  }

  const element = paintElement();
  if (element.textContent !== css) element.textContent = css;
  if (safeLocalStorage.getItem(TOPIC_PAINT_CACHE_KEY) === css) return;
  safeLocalStorage.setItem(TOPIC_PAINT_CACHE_KEY, css);
}

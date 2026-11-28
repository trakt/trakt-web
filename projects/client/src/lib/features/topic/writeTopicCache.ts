import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import type { TopicId } from './models/TopicId.ts';
import { TOPIC_CACHE_KEY } from './TopicCacheKey.ts';

export function writeTopicCache(topic: TopicId | null) {
  if (topic === null) {
    safeLocalStorage.removeItem(TOPIC_CACHE_KEY);
    return;
  }

  safeLocalStorage.setItem(TOPIC_CACHE_KEY, topic);
}

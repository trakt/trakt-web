import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import type { TopicId } from './models/TopicId.ts';
import { TOPIC_CACHE_KEY } from './TopicCacheKey.ts';
import { topicRegistry } from './topicRegistry.ts';

const isTopicId = (value: string | Nil): value is TopicId =>
  value != null && Object.hasOwn(topicRegistry, value);

export function readTopicCache() {
  const stored = safeLocalStorage.getItem(TOPIC_CACHE_KEY);
  return isTopicId(stored) ? stored : null;
}

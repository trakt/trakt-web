import { browser } from '$app/environment';
import { isBotAgent } from '$lib/utils/devices/isBotAgent.ts';

export function isCrawler() {
  if (!browser) {
    return false;
  }

  return isBotAgent(globalThis.navigator.userAgent);
}

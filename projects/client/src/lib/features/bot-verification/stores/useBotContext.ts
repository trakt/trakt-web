import { getContext, setContext } from 'svelte';

const BOT_CONTEXT_KEY = Symbol('botContext');

export function setBotContext(isLegitimateBot: boolean) {
  setContext(BOT_CONTEXT_KEY, isLegitimateBot);
}

export function useBotContext(): boolean {
  try {
    return getContext<boolean>(BOT_CONTEXT_KEY) ?? false;
  } catch {
    return false;
  }
}

import { time } from '$lib/utils/timing/time.ts';
import { BehaviorSubject } from 'rxjs';

export function useInstallPrompt() {
  const promptStore = new BehaviorSubject<BeforeInstallPromptEvent | null>(
    globalThis.install ?? null,
  );

  const interval = setInterval(() => {
    if (globalThis.install) {
      promptStore.next(globalThis.install);
      clearInterval(interval);
    }
  }, time.fps(30));

  setTimeout(() => clearInterval(interval), time.seconds(2.5));

  return {
    subscribe: promptStore.subscribe.bind(promptStore),
    prompt: async () => {
      const event = promptStore.value;

      if (!event) {
        return;
      }

      const result = await event.prompt();

      const isAccepted = result.outcome === 'accepted';

      if (isAccepted) {
        promptStore.next(null);
      }

      return isAccepted;
    },
  };
}

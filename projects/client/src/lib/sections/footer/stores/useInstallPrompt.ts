import { time } from '$lib/utils/timing/time.ts';
import { BehaviorSubject } from 'rxjs';

export function useInstallPrompt() {
  const store = new BehaviorSubject<BeforeInstallPromptEvent | null>(
    globalThis.install,
  );

  const interval = setInterval(() => {
    if (globalThis.install) {
      store.next(globalThis.install);
      clearInterval(interval);
    }
  }, time.fps(30));

  setTimeout(() => clearInterval(interval), time.seconds(2.5));

  return {
    subscribe: store.subscribe.bind(store),
    prompt: async () => {
      const event = store.value;

      if (!event) {
        return;
      }

      const result = await event.prompt();

      const isAccepted = result.outcome === 'accepted';

      if (isAccepted) {
        store.next(null);
      }

      return isAccepted;
    },
  };
}

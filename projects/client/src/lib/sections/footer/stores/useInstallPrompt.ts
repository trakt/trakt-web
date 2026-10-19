import { browser } from '$app/environment';
import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { GlobalEventBus } from '$lib/utils/events/GlobalEventBus.ts';
import { BehaviorSubject } from 'rxjs';
import { onDestroy } from 'svelte';

export function useInstallPrompt() {
  const { track } = useTrack(AnalyticsEvent.PwaInstall);
  const promptStore = new BehaviorSubject<BeforeInstallPromptEvent | null>(
    globalThis.install ?? null,
  );

  if (browser) {
    onDestroy(
      GlobalEventBus.getInstance().register('beforeinstallprompt', (event) =>
        promptStore.next(event),
      ),
    );
  }

  return {
    subscribe: promptStore.subscribe.bind(promptStore),
    prompt: async () => {
      const event = promptStore.value;

      if (!event) {
        return;
      }

      const result = await event.prompt();

      track({ outcome: result.outcome });

      const isAccepted = result.outcome === 'accepted';

      if (isAccepted) {
        promptStore.next(null);
      }

      return isAccepted;
    },
  };
}

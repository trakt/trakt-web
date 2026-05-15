import { browser } from '$app/environment';
import { AnalyticsEvent } from '../../../features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '../../../features/analytics/useTrack.ts';
import type { DrilldownSource } from '../../../sections/lists/components/models/DrilldownSource.ts';

type ShareData = {
  title: string;
  url: string;
  text: string;
};

const IgnoredShareErrors: ReadonlySet<string> = new Set([
  // User dismissed the share sheet.
  'AbortError',
  // The browser already serializes shares, a previous share is still active.
  'InvalidStateError',
]);

export function useShare(source: DrilldownSource) {
  const { track } = useTrack(AnalyticsEvent.Share);

  const share = async (data: ShareData) => {
    const isShareable = browser && Boolean(navigator.canShare) &&
      navigator.canShare(data);
    if (!isShareable) {
      return;
    }

    try {
      await navigator.share(data);
      track({ source: source.id, type: source.type });
    } catch (error) {
      if (error instanceof Error && IgnoredShareErrors.has(error.name)) {
        return;
      }

      throw error;
    }
  };

  return {
    share,
  };
}

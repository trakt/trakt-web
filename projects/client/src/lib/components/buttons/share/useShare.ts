import { browser } from '$app/environment';
import { AnalyticsEvent } from '../../../features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '../../../features/analytics/useTrack.ts';
import type { DrilldownSource } from '../../../sections/lists/components/models/DrilldownSource.ts';

type ShareData = {
  title: string;
  url: string;
  text: string;
};

export function useShare(source: DrilldownSource) {
  const { track } = useTrack(AnalyticsEvent.Share);

  const share = async (data: ShareData) => {
    const isShareable = browser && Boolean(navigator.canShare) &&
      navigator.canShare(data);
    if (!isShareable) {
      return;
    }

    try {
      track({ source: source.id, type: source.type });
      await navigator.share(data);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }

      throw error;
    }
  };

  return {
    share,
  };
}

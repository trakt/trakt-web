import { browser } from '$app/environment';
import { take } from 'rxjs';
import { AnalyticsEvent } from '../../../features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '../../../features/analytics/useTrack.ts';
import { useUser } from '../../../features/auth/stores/useUser.ts';
import type { DrilldownSource } from '../../../sections/lists/components/models/DrilldownSource.ts';
import { toShareUrl } from '../../../utils/url/toShareUrl.ts';

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
  const { user } = useUser();

  // navigator.share needs the tap's transient activation, so the code is read
  // synchronously from the already-loaded settings instead of awaited.
  const currentShareCode = () => {
    let shareCode: string | Nil = null;
    user.pipe(take(1)).subscribe(($user) => {
      shareCode = $user?.shareCode;
    });
    return shareCode;
  };

  const share = async (data: ShareData) => {
    const shareData = {
      ...data,
      url: toShareUrl({ url: data.url, shareCode: currentShareCode() }),
    };
    const isShareable = browser && Boolean(navigator.canShare) &&
      navigator.canShare(shareData);
    if (!isShareable) {
      return;
    }

    try {
      await navigator.share(shareData);
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

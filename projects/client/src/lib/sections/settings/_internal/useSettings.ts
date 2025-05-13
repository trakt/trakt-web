import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import {
  InvalidateAction,
  type InvalidateActionOptions,
} from '$lib/requests/models/InvalidateAction.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import type { SettingsRequest } from '@trakt/api';
import { derived, writable } from 'svelte/store';
import { saveSettingsRequest } from '../../../requests/queries/users/saveSettingsRequest.ts';

type HandleSettingsProps = {
  payload: SettingsRequest;
  action: string;
  invalidateAction: InvalidateActionOptions;
};

export function useSettings() {
  const { user } = useUser();
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.Settings);
  const isSavingSettings = writable(false);

  const handleSettingsChange = async (
    { payload, action, invalidateAction }: HandleSettingsProps,
  ) => {
    isSavingSettings.set(true);

    const success = await saveSettingsRequest({ body: payload });
    if (!success) {
      isSavingSettings.set(false);
      return;
    }

    track({ settings: action });
    await invalidate(invalidateAction);
    isSavingSettings.set(false);
  };

  return {
    isSavingSettings: derived(
      isSavingSettings,
      ($isSavingSettings) => $isSavingSettings,
    ),
    spoilers: derived(user, ($user) => ({
      isHidden: Boolean($user.preferences.isSpoilerHidden),
      set: async (isEnabled: boolean) => {
        const spoilerStatus = isEnabled ? 'hide' as const : 'show' as const;

        const payload = {
          browsing: {
            spoilers: {
              episodes: spoilerStatus,
              shows: spoilerStatus,
              movies: spoilerStatus,
            },
          },
        };

        await handleSettingsChange({
          payload,
          action: 'spoilers',
          invalidateAction: InvalidateAction.User.Settings,
        });
      },
    })),
  };
}

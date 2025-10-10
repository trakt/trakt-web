import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { Theme } from '$lib/features/theme/models/Theme.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { saveSettingsRequest } from '$lib/requests/queries/users/saveSettingsRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import type { SettingsRequest } from '@trakt/api';
import { derived, writable } from 'svelte/store';

type HandleSettingsProps = {
  payload: SettingsRequest;
  action: string;
};

type UserSettingsRequest = SettingsRequest['user'];

function mapToDarkKnight(theme: Theme) {
  switch (theme) {
    case Theme.Light:
      return 'false' as const;
    case Theme.Dark:
      return 'true' as const;
    case Theme.System:
      return 'auto' as const;
  }
}

export function useSettings() {
  const { user } = useUser();
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.Settings);
  const isSavingSettings = writable(false);

  const handleSettingsChange = async (
    { payload, action }: HandleSettingsProps,
  ) => {
    isSavingSettings.set(true);

    const success = await saveSettingsRequest({ body: payload });
    if (!success) {
      isSavingSettings.set(false);
      return;
    }

    track({ settings: action });
    await invalidate(InvalidateAction.User.Settings);
    isSavingSettings.set(false);
  };

  const setTheme = async (theme: Theme) => {
    const payload = {
      browsing: {
        dark_knight: mapToDarkKnight(theme),
      },
    };

    await handleSettingsChange({ payload, action: 'theme' });
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

        await handleSettingsChange({ payload, action: 'spoilers' });
      },
    })),
    profile: derived(user, ($user) => ({
      isPrivate: Boolean($user.isPrivate),
      displayName: $user.name.full,
      location: $user.location ?? '',
      about: $user.about ?? '',
      set: async (settings: UserSettingsRequest) => {
        const payload: SettingsRequest = {
          user: { ...settings },
        };

        await handleSettingsChange({ payload, action: 'profile' });
      },
    })),
    genres: derived(user, ($user) => ({
      favorites: $user.genres ?? [],
      set: async (genres: string[]) => {
        const payload = {
          browsing: {
            genres: {
              favorites: genres,
            },
          },
        };

        await handleSettingsChange({ payload, action: 'genres' });
      },
    })),
    theme: { set: setTheme },
  };
}

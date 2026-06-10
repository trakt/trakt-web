import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { Theme } from '$lib/features/theme/models/Theme.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { changeEmailRequest } from '$lib/requests/queries/users/changeEmailRequest.ts';
import { saveSettingsRequest } from '$lib/requests/queries/users/saveSettingsRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import type { SettingsRequest } from '@trakt/api';
import { BehaviorSubject, map, shareReplay } from 'rxjs';

type HandleSettingsProps = {
  request: () => Promise<boolean>;
  action: string;
};

type UserSettingsRequest = SettingsRequest['user'] & {
  username?: string;
};

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
  const { user: userSource } = useUser();
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.Settings);
  const isSavingSettings = new BehaviorSubject(false);

  // The `user` stream from `useUser` is cold: every `$store` auto-subscription
  // in the settings UI (and there are many - profile, email, spoilers,
  // watch-again, the raw user, ...) would otherwise spin up its own query
  // observer. Sharing a single replayed subscription keeps every settings view
  // reading from one consistent source, so a change emits once and updates the
  // whole page instead of leaving stale views behind.
  const user = userSource.pipe(
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  const handleSettingsChange = async (
    { request, action }: HandleSettingsProps,
  ): Promise<boolean> => {
    isSavingSettings.next(true);

    const success = await request();
    if (!success) {
      isSavingSettings.next(false);
      return false;
    }

    track({ settings: action });
    await invalidate(InvalidateAction.User.Settings);
    isSavingSettings.next(false);
    return true;
  };

  const setTheme = async (theme: Theme) => {
    const payload = {
      browsing: {
        dark_knight: mapToDarkKnight(theme),
      },
    };

    await handleSettingsChange({
      request: () => saveSettingsRequest({ body: payload }),
      action: 'theme',
    });
  };

  return {
    user,
    isSavingSettings: isSavingSettings.asObservable(),
    spoilers: user.pipe(map(($user) => ({
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
          request: () => saveSettingsRequest({ body: payload }),
          action: 'spoilers',
        });
      },
    }))),
    email: user.pipe(map(($user) => ({
      value: $user.email,
      set: (email: string) => {
        if (!$user.email) return Promise.resolve(false);

        return handleSettingsChange({
          request: () => changeEmailRequest({ email }),
          action: 'email',
        });
      },
    }))),
    profile: user.pipe(map(($user) => ({
      isPrivate: Boolean($user.isPrivate),
      displayName: $user.name.full,
      location: $user.location ?? '',
      about: $user.about ?? '',
      birthday: $user.birthday,
      username: $user.username,
      set: (settings: UserSettingsRequest) => {
        const payload: SettingsRequest = {
          user: { ...settings },
        };

        return handleSettingsChange({
          request: () => saveSettingsRequest({ body: payload }),
          action: 'profile',
        });
      },
    }))),
    genres: user.pipe(map(($user) => ({
      favorites: $user.genres ?? [],
      set: async (genres: string[]) => {
        const payload = {
          browsing: {
            genres: {
              favorites: genres,
            },
          },
        };

        await handleSettingsChange({
          request: () => saveSettingsRequest({ body: payload }),
          action: 'genres',
        });
      },
    }))),
    theme: { set: setTheme },
    watchAgain: user.pipe(map(($user) => ({
      hasWatchAgain: $user.preferences.hasWatchAgain,

      set: async (hasWatchAgain: boolean) => {
        const payload = {
          browsing: {
            watch_only_once: !hasWatchAgain,
          },
        };

        await handleSettingsChange({
          request: () => saveSettingsRequest({ body: payload }),
          action: 'watch_only_once',
        });
      },
    }))),
  };
}

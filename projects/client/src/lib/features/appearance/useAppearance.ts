import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';

const APPEARANCE_STORAGE_KEY = 'trakt_appearance';

type AppearancePreferences = Readonly<{
  reduceVisualNoise: boolean;
  reduceWidth: boolean;
  centerDrawers: boolean;
}>;

type AppearancePreferenceKey = keyof AppearancePreferences;

const DEFAULT_APPEARANCE_PREFERENCES: AppearancePreferences = {
  reduceVisualNoise: false,
  reduceWidth: false,
  centerDrawers: false,
};

function readAppearancePreferences(): AppearancePreferences {
  try {
    const stored = safeLocalStorage.getItem(APPEARANCE_STORAGE_KEY);
    if (!stored) return DEFAULT_APPEARANCE_PREFERENCES;

    const parsed: unknown = JSON.parse(stored);
    if (
      typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)
    ) {
      return DEFAULT_APPEARANCE_PREFERENCES;
    }

    const preferences = parsed as Record<string, unknown>;
    return {
      reduceVisualNoise: preferences.reduceVisualNoise === true ||
        preferences.reduceBackgroundImages === true,
      reduceWidth: preferences.reduceWidth === true,
      centerDrawers: preferences.centerDrawers === true,
    };
  } catch {
    return DEFAULT_APPEARANCE_PREFERENCES;
  }
}

const appearancePreferences = new BehaviorSubject(readAppearancePreferences());

function selectPreference(key: AppearancePreferenceKey) {
  return appearancePreferences.pipe(
    map((preferences) => preferences[key]),
    distinctUntilChanged(),
  );
}

function setPreference(key: AppearancePreferenceKey, enabled: boolean) {
  const next = {
    ...appearancePreferences.value,
    [key]: enabled,
  };

  safeLocalStorage.setItem(APPEARANCE_STORAGE_KEY, JSON.stringify(next));
  appearancePreferences.next(next);
}

export function useAppearance() {
  return {
    reduceVisualNoise: selectPreference('reduceVisualNoise'),
    reduceWidth: selectPreference('reduceWidth'),
    centerDrawers: selectPreference('centerDrawers'),
    setReduceVisualNoise: (enabled: boolean) =>
      setPreference('reduceVisualNoise', enabled),
    setReduceWidth: (enabled: boolean) => setPreference('reduceWidth', enabled),
    setCenterDrawers: (enabled: boolean) =>
      setPreference('centerDrawers', enabled),
  };
}

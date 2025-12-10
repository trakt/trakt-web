import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { getLanguageAndRegion } from '$lib/features/i18n/index.ts';
import { toObservable } from '$lib/utils/store/toObservable.ts';
import { map } from 'rxjs';

export function useStreamingPreferences() {
  const { user } = useUser();
  const { region } = getLanguageAndRegion();

  const country = toObservable(user).pipe(
    map((u) => u?.services?.country ?? region),
  );
  const favorites = toObservable(user).pipe(
    map((u) => u?.services?.favorites ?? []),
  );

  return {
    country,
    favorites,
  };
}

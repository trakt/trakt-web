import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';

export function useStreamingPreferences() {
  const { user } = useUser();

  const showOnlyFavorites = new BehaviorSubject(
    Boolean(
      JSON.parse(safeLocalStorage.getItem('show-only-favorites') ?? 'false'),
    ),
  );

  return {
    showOnlyFavorites: showOnlyFavorites.asObservable(),
    favorites: user.pipe(
      map((u) => u?.services.favorites ?? []),
    ),
    country: user.pipe(
      map((u) => u?.services.country || 'us'),
      distinctUntilChanged(),
    ),
    toggleShowOnlyFavorites: () => {
      const newValue = !showOnlyFavorites.value;
      safeLocalStorage.setItem(
        'show-only-favorites',
        JSON.stringify(newValue),
      );
      showOnlyFavorites.next(newValue);
    },
  };
}

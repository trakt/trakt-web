import { useNavigation } from '$lib/features/navigation/useNavigation.ts';
import { toObservable } from '$lib/utils/store/toObservable.ts';
import { map } from 'rxjs';

export function useDefaultCardVariant<M>(type: M) {
  const { navigation } = useNavigation();
  const navigation$ = toObservable(navigation);

  return navigation$.pipe(
    map((n) => {
      if (type === 'episode') {
        return 'landscape' as const;
      }

      const isDPad = n === 'dpad';

      return isDPad ? 'landscape' as const : 'portrait' as const;
    }),
  );
}

import { useNavigation } from '$lib/features/navigation/useNavigation.ts';
import { map } from 'rxjs';

export function useDefaultCardVariant<M>(type: M) {
  const { navigation } = useNavigation();

  return navigation.pipe(
    map(($navigation) => {
      if (type === 'episode') {
        return 'landscape' as const;
      }

      const isDPad = $navigation === 'dpad';

      return isDPad ? 'landscape' as const : 'portrait' as const;
    }),
  );
}

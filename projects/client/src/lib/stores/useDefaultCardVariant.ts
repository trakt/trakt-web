import { useNavigation } from '$lib/features/navigation/useNavigation.ts';
import { derived } from 'svelte/store';

export function useDefaultCardVariant<M>(type: M) {
  const { navigation } = useNavigation();

  return derived(navigation, ($navigation) => {
    if (type === 'episode') {
      return 'landscape' as const;
    }

    const isDPad = $navigation === 'dpad';

    return isDPad ? 'landscape' as const : 'portrait' as const;
  });
}

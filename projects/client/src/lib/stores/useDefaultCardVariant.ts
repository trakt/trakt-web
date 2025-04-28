import { useNavigation } from '$lib/features/navigation/useNavigation.ts';
import { derived } from 'svelte/store';

export function useDefaultCardVariant() {
  const { navigation } = useNavigation();

  return derived(navigation, ($navigation) => {
    const isDPad = $navigation === 'dpad';

    return isDPad ? 'landscape' : 'portrait';
  });
}

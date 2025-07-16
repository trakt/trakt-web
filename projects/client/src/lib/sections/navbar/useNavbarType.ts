import { derived, type Readable } from 'svelte/store';
import { useNavigation } from '../../features/navigation/useNavigation.ts';
import { useMedia, WellKnownMediaQuery } from '../../stores/css/useMedia.ts';

type NavbarType = 'top' | 'side';

export function useNavbarType(): {
  navbarType: Readable<NavbarType>;
} {
  const { navigation } = useNavigation();

  const isDesktop = useMedia(WellKnownMediaQuery.desktop);
  const isTabletLarge = useMedia(WellKnownMediaQuery.tabletLarge);

  return {
    navbarType: derived(
      [navigation, isDesktop, isTabletLarge],
      ([$navigation, isDesktop, isTabletLarge]) => {
        if ($navigation === 'dpad') {
          return 'side';
        }

        return isDesktop || isTabletLarge ? 'side' : 'top';
      },
    ),
  };
}

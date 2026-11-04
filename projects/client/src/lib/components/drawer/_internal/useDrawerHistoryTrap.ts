import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
import { navigating, page } from '$app/state';
import { replaceDrawerUrl } from '$lib/components/drawer/replaceDrawerUrl.ts';
import { onMount, tick } from 'svelte';
import { drawerHistoryTrap } from './drawerHistoryTrap.ts';

type DrawerHistoryTrapProps = {
  isEnabled: () => boolean;
  isPresent: () => boolean;
  onPop: () => void;
};

const nextFrame = () =>
  new Promise((resolve) => requestAnimationFrame(resolve));

const whenDismissSettles = async () => {
  await tick();
  await new Promise((resolve) => setTimeout(resolve));
  await navigating.complete?.catch(() => undefined);
  await tick();
  await nextFrame();
  await nextFrame();
};

export function useDrawerHistoryTrap({
  isEnabled,
  isPresent,
  onPop,
}: DrawerHistoryTrapProps) {
  let trapId: string | undefined;
  let isMounted = false;

  const arm = () => {
    trapId = drawerHistoryTrap.push(() => {
      trapId = undefined;
      onPop();

      whenDismissSettles().then(() => {
        if (isMounted && isPresent()) arm();
      });
    });
  };

  beforeNavigate((navigation) => {
    const target = navigation.to;
    if (navigation.willUnload || !target) return;
    if (navigation.type !== 'link' && navigation.type !== 'goto') return;
    if (!trapId || !drawerHistoryTrap.isActive(trapId)) return;
    if (drawerHistoryTrap.isOwnNavigation(target.url)) return;

    navigation.cancel();

    if (target.url.pathname === page.url.pathname) {
      replaceDrawerUrl(target.url, { keepFocus: true });
      return;
    }

    drawerHistoryTrap
      .release()
      // eslint-disable-next-line svelte/no-navigation-without-resolve
      .then(() => goto(target.url));
  });

  afterNavigate((navigation) => {
    if (!trapId || navigation.type !== 'goto') return;
    if (navigation.from?.url.pathname !== navigation.to?.url.pathname) return;

    drawerHistoryTrap.restore();
  });

  onMount(() => {
    if (!isEnabled()) return;

    isMounted = true;
    const frame = requestAnimationFrame(arm);

    return () => {
      isMounted = false;
      cancelAnimationFrame(frame);
      if (trapId) drawerHistoryTrap.remove(trapId);
    };
  });
}

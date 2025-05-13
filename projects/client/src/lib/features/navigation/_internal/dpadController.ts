import { afterNavigate } from '$app/navigation';
import { GlobalEventBus } from '$lib/utils/events/GlobalEventBus.ts';
import { onMount } from 'svelte';
import { useNavbarNavigation } from '../useNavbarNavigation.ts';
import { focusSomething } from './focusSomething.ts';
import { handleItemNavigation } from './handleItemNavigation.ts';
import { handleListNavigation } from './handleListNavigation.ts';
import { handleNavbarNavigation } from './handleNavbarNavigation.ts';
import { isEnteringNavbar } from './isEnteringNavbar.ts';
import { isInNavbar } from './isInNavbar.ts';

type HandlerProps = {
  ev: KeyboardEvent;
  enterNavbar: () => void;
  leaveNavbar: () => void;
};

const handler = ({ ev, enterNavbar, leaveNavbar }: HandlerProps) => {
  switch (ev.key) {
    case 'ArrowLeft':
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowRight':
      focusSomething();
      ev.preventDefault();
      break;
  }

  switch (ev.key) {
    case 'ArrowLeft':
    case 'ArrowRight':
      if (isInNavbar()) {
        ev.key === 'ArrowRight' && leaveNavbar();
        return;
      }

      if (isEnteringNavbar(ev.key)) {
        enterNavbar();
        return;
      }

      handleItemNavigation(ev.key);
      break;
    case 'ArrowUp':
    case 'ArrowDown':
      if (isInNavbar()) {
        handleNavbarNavigation(ev.key);
        return;
      }

      handleListNavigation(ev.key);
      break;
  }
};

export function dpadController(_: HTMLElement) {
  const { leaveNavbar, enterNavbar, reset } = useNavbarNavigation();

  onMount(() => {
    focusSomething(true);

    const destroy = GlobalEventBus.getInstance().register('keydown', (ev) => {
      handler({ ev, leaveNavbar, enterNavbar });
    });

    return {
      destroy,
    };
  });

  afterNavigate((nav) => {
    if (!['link', 'popstate'].includes(nav.type) || nav.willUnload) {
      return;
    }

    reset();
    focusSomething(true);
  });
}

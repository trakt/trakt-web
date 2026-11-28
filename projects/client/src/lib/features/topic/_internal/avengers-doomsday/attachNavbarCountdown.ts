import { mount, unmount } from 'svelte';
import { attachAll } from '../shared/attachAll.ts';
import DoomsdayCountdown from './DoomsdayCountdown.svelte';

export function attachNavbarCountdown() {
  return attachAll({
    selector: '.trakt-mobile-navbar',
    attach: (target) => {
      const countdown = mount(DoomsdayCountdown, {
        target,
        props: { placement: 'dock' },
      });
      return () => {
        unmount(countdown);
      };
    },
  });
}

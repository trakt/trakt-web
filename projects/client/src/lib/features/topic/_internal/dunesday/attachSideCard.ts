import { mount, unmount } from 'svelte';
import { attachAll } from '../shared/attachAll.ts';
import SideCard from './SideCard.svelte';

const OWN_PROFILE = /^\/profile\/me\/?$/;

export function attachSideCard() {
  return attachAll({
    selector: '.trakt-profile-container',
    attach: (container) => {
      if (!OWN_PROFILE.test(window.location.pathname)) return;
      const host = document.createElement('div');
      host.className = 'dd-side-card-host';
      host.style.marginInline = getComputedStyle(container).marginInline;
      container.after(host);
      const card = mount(SideCard, { target: host });
      return () => {
        void unmount(card);
        host.remove();
      };
    },
  });
}

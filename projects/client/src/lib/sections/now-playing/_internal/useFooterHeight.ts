import { FOOTER_CLASS_NAME } from '$lib/sections/footer/constants.ts';
import { onMount } from 'svelte';
import { derived, writable } from 'svelte/store';

export function useFooterHeight() {
  const footerHeight = writable(0);

  onMount(() => {
    const footer = globalThis.document.querySelector(`.${FOOTER_CLASS_NAME}`);
    if (!footer) {
      return;
    }

    footerHeight.set(footer.clientHeight);

    const observer = new MutationObserver(() => {
      footerHeight.set(footer.clientHeight);
    });

    observer.observe(footer, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  });

  return {
    footerHeight: derived(footerHeight, ($footerHeight) => $footerHeight),
  };
}

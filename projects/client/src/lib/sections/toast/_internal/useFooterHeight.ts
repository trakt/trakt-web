import { FOOTER_CLASS_NAME } from '$lib/sections/footer/constants.ts';
import { BehaviorSubject } from 'rxjs';
import { onMount } from 'svelte';

export function useFooterHeight() {
  const footerHeight = new BehaviorSubject(0);

  onMount(() => {
    const footer = globalThis.document.querySelector(`.${FOOTER_CLASS_NAME}`);
    if (!footer) {
      return;
    }

    footerHeight.next(footer.clientHeight);

    const observer = new MutationObserver(() => {
      footerHeight.next(footer.clientHeight);
    });

    observer.observe(footer, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  });

  return {
    footerHeight: footerHeight.asObservable(),
  };
}

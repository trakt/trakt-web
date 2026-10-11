import { BehaviorSubject } from 'rxjs';
import { onMount } from 'svelte';

const MOBILE_NAVBAR_SELECTOR = '.trakt-mobile-navbar';

export function useMobileNavbarHeight() {
  const height = new BehaviorSubject(0);

  onMount(() => {
    let navbar: Element | null = null;
    let resizeObserver: ResizeObserver | undefined;
    let frame = 0;

    const measure = () => {
      const next = navbar ? navbar.getBoundingClientRect().height : 0;

      if (height.value !== next) {
        height.next(next);
      }
    };

    const track = () => {
      const current = document.querySelector(MOBILE_NAVBAR_SELECTOR);

      if (current !== navbar) {
        resizeObserver?.disconnect();
        navbar = current;

        if (navbar) {
          resizeObserver = new ResizeObserver(measure);
          resizeObserver.observe(navbar);
        }

        measure();
      }
    };

    const scheduleTrack = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(track);
    };

    track();

    const mutationObserver = new MutationObserver(scheduleTrack);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      mutationObserver.disconnect();
      resizeObserver?.disconnect();
    };
  });

  return { height };
}

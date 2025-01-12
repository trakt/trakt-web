import { afterNavigate } from '$app/navigation';
import { page } from '$app/state';
import { writable } from 'svelte/store';

const isMatch = (href: string | Nil, route: string | Nil) => href === route;

export function useActiveLink(href: string | Nil) {
  const isActive = writable(isMatch(href, page.url.pathname));

  afterNavigate((nav) => {
    isActive.set(isMatch(
      href,
      nav.to?.url.pathname,
    ));
  });

  return {
    isActive,
  };
}

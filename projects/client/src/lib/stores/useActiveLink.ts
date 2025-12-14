import { afterNavigate } from '$app/navigation';
import { page } from '$app/state';
import { BehaviorSubject } from 'rxjs';

const isMatch = (href: string | Nil, route: string | Nil) => href === route;

export function useActiveLink(href: string | Nil) {
  const isActive = new BehaviorSubject(isMatch(href, page.url.pathname));

  afterNavigate((nav) => {
    isActive.next(isMatch(
      href,
      nav.to?.url.pathname,
    ));
  });

  return {
    isActive: isActive.asObservable(),
  };
}

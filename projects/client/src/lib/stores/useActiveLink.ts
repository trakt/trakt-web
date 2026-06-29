import { afterNavigate } from '$app/navigation';
import { page } from '$app/state';
import { BehaviorSubject } from 'rxjs';

type ActiveLinkOptions = {
  // Also match nested routes (e.g. `/settings/apps` stays active on
  // `/settings/apps/api`). Off by default so links match their exact path.
  nested?: boolean;
};

const isMatch = (
  href: string | Nil,
  route: string | Nil,
  nested: boolean,
) => {
  if (href == null || route == null) {
    return false;
  }

  if (href === route) {
    return true;
  }

  return nested && route.startsWith(`${href}/`);
};

export function useActiveLink(href: string | Nil, options?: ActiveLinkOptions) {
  const nested = options?.nested ?? false;
  const isActive = new BehaviorSubject(
    isMatch(href, page.url.pathname, nested),
  );

  afterNavigate((nav) => {
    isActive.next(isMatch(
      href,
      nav.to?.url.pathname,
      nested,
    ));
  });

  return {
    isActive: isActive.asObservable(),
  };
}

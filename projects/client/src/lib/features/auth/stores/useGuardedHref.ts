import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { UrlBuilder } from '../../../utils/url/UrlBuilder.ts';
import { useAuth } from './useAuth.ts';

export function useGuardedHref(href: string | Nil) {
  const originalHref = of(href);

  try {
    const { isAuthorized } = useAuth();

    const guardedHref = isAuthorized.pipe(
      map((authorized) => {
        if (href == null) {
          return href;
        }

        /**
         * TODO: when we have v3 auth flow we can improve by having a returnUrl
         * this would return real users to what they wanted to access instead of home page after login
         */
        return authorized ? href : UrlBuilder.home();
      }),
    );

    return { guardedHref, originalHref };
  } catch {
    /**
     * If used outside of an AuthProvider, we should return the original href without guarding it.
     */
    return { guardedHref: originalHref, originalHref };
  }
}

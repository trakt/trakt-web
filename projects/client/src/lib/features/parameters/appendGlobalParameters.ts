import { WHITE_LISTED_PARAMS } from '$lib/features/parameters/_internal/constants.ts';
import { useParameters } from '$lib/features/parameters/useParameters.ts';
import { buildParamString } from '$lib/utils/url/buildParamString.ts';
import { combineLatest } from 'rxjs';

export function appendGlobalParameters(anchor: HTMLAnchorElement) {
  const { search, override, isEscaped } = useParameters();

  const subscription = combineLatest([search, override, isEscaped])
    .subscribe(([searchParams, overrideKey, escaped]) => {
      if (escaped) return;

      const isExternal = globalThis.window.location.origin !== anchor.origin;
      if (isExternal) return;

      const url = new URL(anchor.href);

      const params = [
        ...Array.from(url.searchParams.entries())
          .filter(([key]) =>
            key === overrideKey || !WHITE_LISTED_PARAMS.includes(key)
          ),
        ...searchParams.entries(),
      ]
        .reduce(
          (acc, [key, value]) => {
            acc[key] = value;
            return acc;
          },
          {} as Record<string, string | number | Nil>,
        );
      anchor.href = `${url.pathname}${buildParamString(params)}`;
    });

  return {
    destroy: () => subscription.unsubscribe(),
  };
}

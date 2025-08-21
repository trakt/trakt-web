import { WHITE_LISTED_PARAMS } from '$lib/features/parameters/_internal/constants.ts';
import { useParameters } from '$lib/features/parameters/useParameters.ts';
import { NOOP_FN } from '$lib/utils/constants.ts';
import { buildParamString } from '$lib/utils/url/buildParamString.ts';
import { derived } from 'svelte/store';

export function appendGlobalParameters(anchor: HTMLAnchorElement) {
  const { search, override, isEscaped } = useParameters();

  const destroy = derived(
    [search, override, isEscaped],
    ([$search, $override, $isEscaped]) => {
      if ($isEscaped) return;

      const isExternal = globalThis.window.location.origin !== anchor.origin;
      if (isExternal) return;

      const url = new URL(anchor.href);

      const params = [
        ...Array.from(url.searchParams.entries())
          .filter(([key]) =>
            key === $override || !WHITE_LISTED_PARAMS.includes(key)
          ),
        ...$search.entries(),
      ]
        .reduce(
          (acc, [key, value]) => {
            acc[key] = value;
            return acc;
          },
          {} as Record<string, string | number | Nil>,
        );
      anchor.href = `${url.pathname}${buildParamString(params)}`;
    },
  ).subscribe(NOOP_FN);

  return {
    destroy,
  };
}

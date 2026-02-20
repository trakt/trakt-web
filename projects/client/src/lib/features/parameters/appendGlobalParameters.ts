import { WHITE_LISTED_PARAMS } from '$lib/features/parameters/_internal/constants.ts';
import { useParameters } from '$lib/features/parameters/useParameters.ts';
import { buildParamString } from '$lib/utils/url/buildParamString.ts';
import { combineLatest } from 'rxjs';

export function appendGlobalParameters(
  anchor: HTMLAnchorElement,
  _href?: string | Nil,
) {
  const { search, override, isEscaped } = useParameters();

  let latestValues: [URLSearchParams, string, boolean] | null = null;

  const applyParams = () => {
    if (!latestValues) return;

    const [$search, $override, $isEscaped] = latestValues;

    if ($isEscaped) return;

    const isExternal = globalThis.window.location.origin !== anchor.origin;
    if (isExternal) return;

    const url = new URL(anchor.href);

    const params = Object.fromEntries([
      ...Array.from(url.searchParams.entries())
        .filter(([key]) =>
          key === $override || !WHITE_LISTED_PARAMS.includes(key)
        ),
      ...$search.entries(),
    ]);

    anchor.href = `${url.pathname}${buildParamString(params)}`;
  };

  const subscription = combineLatest(
    [search, override, isEscaped],
  ).subscribe({
    next: (values: [URLSearchParams, string, boolean]) => {
      latestValues = values;
      applyParams();
    },
    error: console.error,
  });

  return {
    update: () => applyParams(),
    destroy: () => subscription.unsubscribe(),
  };
}

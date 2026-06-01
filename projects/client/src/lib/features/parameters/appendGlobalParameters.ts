import {
  LOCAL_PARAMS,
  WHITE_LISTED_PARAMS,
} from '$lib/features/parameters/_internal/constants.ts';
import { useParameters } from '$lib/features/parameters/useParameters.ts';
import { buildParamString } from '$lib/utils/url/buildParamString.ts';
import { combineLatest } from 'rxjs';

export function appendGlobalParameters(
  anchor: HTMLAnchorElement,
  href?: string | Nil,
) {
  const { search, override, isEscaped } = useParameters();

  // Track the original href separately — anchor.href gets mutated by applyParams,
  // so we can't re-read it on subsequent calls. The update() callback keeps this
  // in sync when the action parameter changes reactively.
  let originalHref = href ?? anchor.getAttribute('href') ?? '';

  let latestValues: [URLSearchParams, string, boolean] | null = null;

  const applyParams = () => {
    if (!latestValues) return;

    const [$search, $override, $isEscaped] = latestValues;

    if ($isEscaped) return;

    const url = new URL(originalHref, globalThis.window.location.href);

    const isExternal = globalThis.window.location.origin !== url.origin;
    if (isExternal) return;

    const currentUrl = new URL(globalThis.window.location.href);
    const isSamePath = url.pathname === currentUrl.pathname;

    const localParams = isSamePath && Boolean($override)
      ? Array.from(currentUrl.searchParams.entries())
        .filter(([key]) => LOCAL_PARAMS.includes(key))
      : [];

    const params = Object.fromEntries([
      ...localParams,
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
    update: (newHref?: string | Nil) => {
      originalHref = newHref ?? originalHref;
      applyParams();
    },
    destroy: () => subscription.unsubscribe(),
  };
}

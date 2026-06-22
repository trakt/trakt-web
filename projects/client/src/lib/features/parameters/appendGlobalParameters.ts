import {
  filterScopeStore,
  type FilterScopeValue,
} from '$lib/features/filters/filterScopeStore.ts';
import {
  LOCAL_PARAMS,
  WHITE_LISTED_PARAMS,
} from '$lib/features/parameters/_internal/constants.ts';
import { FILTER_KEYS } from '$lib/features/filters/filterKeys.ts';
import { useParameters } from '$lib/features/parameters/useParameters.ts';
import { buildParamString } from '$lib/utils/url/buildParamString.ts';
import { combineLatest } from 'rxjs';

function buildEffectiveSearch({
  search,
  filterScope,
  overrideKey,
}: {
  search: URLSearchParams;
  filterScope: FilterScopeValue;
  overrideKey: string;
}): URLSearchParams {
  if (!filterScope) return search;

  const result = new URLSearchParams(search);
  for (const key of FILTER_KEYS) {
    result.delete(key);
  }
  for (const [key, value] of Object.entries(filterScope)) {
    if (key !== overrideKey) {
      result.set(key, value);
    }
  }
  return result;
}

export function appendGlobalParameters(
  anchor: HTMLAnchorElement,
  href?: string | Nil,
) {
  const { search, override, isEscaped } = useParameters();

  // Track the original href separately — anchor.href gets mutated by applyParams,
  // so we can't re-read it on subsequent calls. The update() callback keeps this
  // in sync when the action parameter changes reactively.
  let originalHref = href ?? anchor.getAttribute('href') ?? '';

  let latestValues:
    | [URLSearchParams, string, boolean, FilterScopeValue]
    | null = null;

  const applyParams = () => {
    if (!latestValues) return;

    const [$search, $override, $isEscaped, $filterScope] = latestValues;

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

    // Same-path navigation (type/sort toggles, etc.) must reflect the user's
    // live filter edits. Only outbound (different-path) links fall back to the
    // frozen local snapshot, so navigating away restores the global filters.
    const effectiveSearch = isSamePath ? $search : buildEffectiveSearch({
      search: $search,
      filterScope: $filterScope,
      overrideKey: $override,
    });

    const params = Object.fromEntries([
      ...localParams,
      ...Array.from(url.searchParams.entries())
        .filter(([key]) =>
          key === $override || !WHITE_LISTED_PARAMS.includes(key)
        ),
      ...effectiveSearch.entries(),
    ]);

    anchor.href = `${url.pathname}${buildParamString(params)}`;
  };

  const subscription = combineLatest(
    [search, override, isEscaped, filterScopeStore],
  ).subscribe({
    next: (values: [URLSearchParams, string, boolean, FilterScopeValue]) => {
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

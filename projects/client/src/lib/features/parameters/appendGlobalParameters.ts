import {
  filterScopeStore,
  type FilterScopeValue,
} from '$lib/features/filters/filterScopeStore.ts';
import {
  LOCAL_PARAMS,
  OUTBOUND_PARAMS,
  WHITE_LISTED_PARAMS,
} from '$lib/features/parameters/_internal/constants.ts';
import { FILTER_KEYS } from '$lib/features/filters/filterKeys.ts';
import { useParameters } from '$lib/features/parameters/useParameters.ts';
import { buildParamString } from '$lib/utils/url/buildParamString.ts';
import { combineLatest } from 'rxjs';

type ParameterSnapshot = [
  URLSearchParams,
  string,
  boolean,
  FilterScopeValue,
  URL,
];

function buildOutboundSearch({
  search,
  filterScope,
  overrideKey,
}: {
  search: URLSearchParams;
  filterScope: FilterScopeValue;
  overrideKey: string;
}): URLSearchParams {
  const result = new URLSearchParams(
    Array.from(search.entries())
      .filter(([key]) => OUTBOUND_PARAMS.includes(key)),
  );

  if (!filterScope) return result;

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
  const { search, override, isEscaped, url } = useParameters();

  // Track the original href separately — anchor.href gets mutated by applyParams,
  // so we can't re-read it on subsequent calls. The update() callback keeps this
  // in sync when the action parameter changes reactively.
  let originalHref = href ?? anchor.getAttribute('href') ?? '';

  let latestValues: ParameterSnapshot | null = null;

  const applyParams = () => {
    if (!latestValues) return;

    const [$search, $override, $isEscaped, $filterScope, $url] = latestValues;

    if ($isEscaped) return;

    const target = new URL(originalHref, $url.href);

    const isExternal = $url.origin !== target.origin;
    if (isExternal) return;

    const isSamePath = target.pathname === $url.pathname;

    const localParams = isSamePath && Boolean($override)
      ? Array.from($url.searchParams.entries())
        .filter(([key]) => LOCAL_PARAMS.includes(key))
      : [];

    // Same-path navigation (type/sort toggles, etc.) must reflect the user's
    // live filter edits. Only outbound (different-path) links fall back to the
    // frozen local snapshot, so navigating away restores the global filters.
    const effectiveSearch = isSamePath ? $search : buildOutboundSearch({
      search: $search,
      filterScope: $filterScope,
      overrideKey: $override,
    });

    const params = Object.fromEntries([
      ...localParams,
      ...Array.from(target.searchParams.entries())
        .filter(([key]) =>
          key === $override || !WHITE_LISTED_PARAMS.includes(key)
        ),
      ...effectiveSearch.entries(),
    ]);

    anchor.href = `${target.pathname}${buildParamString(params)}`;
  };

  const subscription = combineLatest(
    [search, override, isEscaped, filterScopeStore, url],
  ).subscribe({
    next: (values: ParameterSnapshot) => {
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

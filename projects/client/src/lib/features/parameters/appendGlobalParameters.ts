import { useParameters } from '$lib/features/parameters/useParameters.ts';
import { buildParamString } from '$lib/utils/url/buildParamString.ts';

export function appendGlobalParameters(anchor: HTMLAnchorElement) {
  const { search } = useParameters();

  const destroy = search.subscribe(($search) => {
    const isExternal = globalThis.window.location.origin !== anchor.origin;
    if (!$search || isExternal) return;

    const url = new URL(anchor.href);

    const params = [
      ...url.searchParams.entries(),
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
  });

  return {
    destroy,
  };
}

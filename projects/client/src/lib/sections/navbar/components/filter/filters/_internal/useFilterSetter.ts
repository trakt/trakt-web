import { goto } from '$app/navigation';
import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { FilterMode } from '$lib/features/filters/models/FilterMode.ts';
import { useFilter } from '$lib/features/filters/useFilter.ts';
import {
  applyFilterToUrl,
  type ApplyFilterToUrlProps,
} from './applyFilterToUrl.ts';
import { getAdditionalKeys } from './getAdditionalKeys.ts';

type GoToFilteredStateProps = {
  mode: FilterMode;
} & ApplyFilterToUrlProps;

function parseRawValue(value: string) {
  const parts = value.split('-');
  if (parts.length === 2) {
    const minVal = parts[0] === '' ? NaN : Number(parts[0]);
    const maxVal = parts[1] === '' ? NaN : Number(parts[1]);

    if (!isNaN(minVal) && !isNaN(maxVal)) {
      return { range: { min: minVal, max: maxVal } };
    }
  }

  return { value };
}

export function useFilterSetter() {
  const { track } = useTrack(AnalyticsEvent.Filter);
  const { filters } = useFilter();

  return {
    gotoFilteredState: (props: GoToFilteredStateProps) => {
      const hasValue = 'range' in props
        ? Boolean(props.range)
        : Boolean(props.value);

      track({
        id: props.key,
        action: hasValue ? 'set' : 'reset',
        mode: props.mode,
      });

      const url = applyFilterToUrl(
        new URL(globalThis.window.location.href),
        props,
      );
      goto(url, { keepFocus: true, replaceState: true });
    },
    syncAdditionalKeys: (filterMap: Record<string, string>) => {
      const additionalFilters: ApplyFilterToUrlProps[] = [];

      Object.entries(filterMap).forEach(([key, rawValue]) => {
        const filter = filters.find((f) => f.key === key);
        if (!filter) return;

        const additionalKeys = getAdditionalKeys(filter);
        if (additionalKeys.length === 0) return;

        additionalFilters.push({
          key: filter.key,
          additionalKeys,
          ...parseRawValue(rawValue),
        });
      });

      if (additionalFilters.length === 0) return;

      const url = applyFilterToUrl(
        new URL(globalThis.window.location.href),
        additionalFilters,
      );
      goto(url, { keepFocus: true, replaceState: true });
    },
  };
}

import type { FilterKey } from '$lib/features/filters/models/Filter.ts';
import type { AdditionalKey } from '$lib/features/filters/models/FilterOptions.ts';

type BaseProps = {
  key: FilterKey;
  additionalKeys?: AdditionalKey[];
};

type ValueProp = {
  value: string | null;
};

type RangeProp = {
  range: { min: number; max: number } | null;
};

export type ApplyFilterToUrlProps =
  & BaseProps
  & (ValueProp | RangeProp);

type FilterValue = { key: FilterKey; value: string | null };

function getFilterValues(props: ApplyFilterToUrlProps): FilterValue[] {
  if ('value' in props) {
    return [{ key: props.key, value: props.value }];
  }

  const value = props.range ? `${props.range.min}-${props.range.max}` : null;
  const additionalValues = (props.additionalKeys ?? [])
    .map(({ key, mapper }) => {
      if (!mapper) return { key, value };

      return {
        key,
        value: props.range ? mapper(props.range) : value,
      };
    });

  return [{ key: props.key, value }, ...additionalValues];
}

export function applyFilterToUrl(
  url: URL,
  props: ApplyFilterToUrlProps | ApplyFilterToUrlProps[],
): URL {
  const propsArray = Array.isArray(props) ? props : [props];
  const values = propsArray.flatMap(getFilterValues);

  values.forEach(({ key, value }) => {
    if (!value) {
      url.searchParams.delete(key);
      return;
    }

    url.searchParams.set(key, value);
  });

  return url;
}

import {
  type SmartListFilters,
  SmartListFiltersSchema,
} from '$lib/requests/models/SmartListFilters.ts';
import { SMART_LIST_EXTRA_PARAM_TYPES } from './smartListExtraParamTypes.ts';

type ParamType =
  (typeof SMART_LIST_EXTRA_PARAM_TYPES)[keyof typeof SMART_LIST_EXTRA_PARAM_TYPES];

const toValue = (type: ParamType, raw: string): unknown => {
  switch (type) {
    case 'list':
      return raw
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    case 'range':
      return raw.split('-').map(Number);
    case 'boolean':
      return raw === 'true';
    case 'number':
      return Number(raw);
    case 'text':
      return raw;
  }
};

const isValid = (key: string, value: unknown) =>
  SmartListFiltersSchema.safeParse({ [key]: value }).success;

export function fromSmartListExtraParams(
  params: URLSearchParams,
): SmartListFilters {
  return Object.entries(SMART_LIST_EXTRA_PARAM_TYPES).reduce<SmartListFilters>(
    (filters, [key, type]) => {
      const raw = params.get(key);
      if (!raw) return filters;

      const value = toValue(type, raw);
      if (!isValid(key, value)) return filters;

      return { ...filters, [key]: value };
    },
    {},
  );
}

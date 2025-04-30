import { FilterKey } from '$lib/features/filters/models/Filter.ts';
import { getRecordDependencies } from './getRecordDependencies.ts';

export function getGlobalFilterDependencies(
  params: Record<string, string | number | boolean> | Nil,
): string[] {
  return getRecordDependencies(params, Object.values(FilterKey));
}

import { FILTER_KEYS } from '$lib/features/filters/filterKeys.ts';
import { getRecordDependencies } from './getRecordDependencies.ts';

export function getGlobalFilterDependencies(
  params: Record<string, string | number | boolean> | Nil,
): string[] {
  return getRecordDependencies(params, FILTER_KEYS);
}

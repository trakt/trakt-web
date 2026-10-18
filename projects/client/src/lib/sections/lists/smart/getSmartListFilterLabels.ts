import type { SmartList } from '$lib/requests/queries/users/smartListQuery.ts';
import { toSmartListFilterLabel } from './toSmartListFilterLabel.ts';
import { toSmartListSourceLabel } from './toSmartListSourceLabel.ts';

export function getSmartListFilterLabels(
  list: Pick<SmartList, 'source' | 'filters'>,
): string[] {
  const filters = Object.entries(list.filters).flatMap(([key, value]) =>
    toSmartListFilterLabel(key, value),
  );

  return [toSmartListSourceLabel(list.source), ...filters];
}

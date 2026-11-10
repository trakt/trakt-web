import type { SmartList } from '$lib/requests/queries/users/smartListQuery.ts';
import type { SmartListAwardLabel } from './models/SmartListAwardLabel.ts';
import { toSmartListFilterLabel } from './toSmartListFilterLabel.ts';
import { toSmartListSourceLabel } from './toSmartListSourceLabel.ts';

export function getSmartListFilterLabels(
  list: Pick<SmartList, 'source' | 'filters'>,
  awardLabels?: ReadonlyMap<string, SmartListAwardLabel>,
): string[] {
  const filters = Object.entries(list.filters).flatMap(([key, value]) =>
    toSmartListFilterLabel({ key, value, awardLabels }),
  );

  return [toSmartListSourceLabel(list.source), ...filters];
}

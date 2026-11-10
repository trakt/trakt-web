import type { SmartList } from '$lib/requests/queries/users/smartListQuery.ts';
import { getSmartListFilterLabels } from './getSmartListFilterLabels.ts';
import type { SmartListAwardLabel } from './models/SmartListAwardLabel.ts';

export function getSmartListFilterSummary(
  list: SmartList,
  awardLabels?: ReadonlyMap<string, SmartListAwardLabel>,
): string {
  return getSmartListFilterLabels(list, awardLabels).join(', ');
}

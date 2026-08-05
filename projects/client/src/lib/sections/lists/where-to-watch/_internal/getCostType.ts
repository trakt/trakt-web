import type { CostType } from './getMediaCost.ts';
import { StreamingGroup } from './models/StreamingGroup.ts';

export function getCostType(group: StreamingGroup): CostType {
  switch (group) {
    case StreamingGroup.Rent:
      return 'rent';
    case StreamingGroup.Purchase:
      return 'purchase';
    default:
      return 'any';
  }
}

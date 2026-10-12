import { toDismissalKey } from './toDismissalKey.ts';

type LegacyItem = { id: string; type: string; dismissedAt: number };

function isLegacyItem(item: unknown): item is LegacyItem {
  return !!item && typeof item === 'object' && 'id' in item &&
    'type' in item && 'dismissedAt' in item;
}

export function fromLegacyDismissals(legacy: unknown): unknown {
  if (!legacy || typeof legacy !== 'object' || !('items' in legacy)) {
    return null;
  }
  if (!Array.isArray(legacy.items)) return null;

  return Object.fromEntries(
    legacy.items
      .filter(isLegacyItem)
      .map((item) => [toDismissalKey(item), item.dismissedAt]),
  );
}

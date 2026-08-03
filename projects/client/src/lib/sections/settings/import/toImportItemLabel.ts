import { ALL_IDS } from './engine/pickIds.ts';
import type { UniversalImportItem } from './ImportTypes.ts';

export function toImportItemLabel(item: UniversalImportItem): string {
  if (item.title) return item.title;

  const key = ALL_IDS.find((candidate) => item.ids[candidate] != null);
  return key ? `${key}:${item.ids[key]}` : item.type;
}

import type {
  ImportActionSelection,
  UniversalImportItem,
} from './ImportTypes.ts';

interface FilterImportItemsByActionSelectionParams {
  items: ReadonlyArray<UniversalImportItem>;
  selectedActions: ImportActionSelection;
}

export function filterImportItemsByActionSelection(
  { items, selectedActions }: FilterImportItemsByActionSelectionParams,
): UniversalImportItem[] {
  return items.filter((item) => selectedActions[item.action]);
}

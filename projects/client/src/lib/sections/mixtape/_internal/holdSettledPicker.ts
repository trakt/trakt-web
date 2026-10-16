import type { PickerItems } from './PickerItems.ts';

export type HeldPicker<T> = {
  settled: PickerItems<T> | null;
  shown: PickerItems<T>;
};

type PickerUpdate<T> = {
  picker: PickerItems<T>;
  isSettling: boolean;
  isHistoryLoading: boolean;
};

export function holdSettledPicker<T>(
  previous: HeldPicker<T> | null,
  { picker, isSettling, isHistoryLoading }: PickerUpdate<T>,
): HeldPicker<T> {
  const settled = previous?.settled ?? null;

  if (isHistoryLoading) return { settled, shown: picker };
  if (!isSettling) return { settled: picker, shown: picker };

  return { settled, shown: settled ?? picker };
}

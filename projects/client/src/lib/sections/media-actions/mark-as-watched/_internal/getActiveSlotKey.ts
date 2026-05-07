import type { SlottedEntry } from '$lib/sections/media-actions/mark-as-watched/_internal/models/SlottedEntry.ts';

type CurrentSelection = {
  date: Date;
  key: string | Nil;
};

function getSlotBounds(slot: SlottedEntry) {
  const t1 = slot.startDate.getTime();
  const t2 = slot.endDate.getTime();
  return {
    min: Math.min(t1, t2),
    max: Math.max(t1, t2),
  };
}

export function getActiveSlotKey(
  selection: CurrentSelection,
  history: SlottedEntry[],
): string | null {
  const dateTime = selection.date.getTime();

  const isSlotInRange = (slot: SlottedEntry) => {
    const { min, max } = getSlotBounds(slot);
    return dateTime >= min && dateTime <= max;
  };

  if (selection.key) {
    const slot = history.find((s) => s.key === selection.key);
    if (!slot) return null;

    if (isSlotInRange(slot)) {
      return selection.key;
    }
  }

  return (
    history.find((slot) => isSlotInRange(slot))?.key ?? null
  );
}

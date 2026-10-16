type Suggestion = { media: { id: number }; match: number };

type SlotState<T> = { slots: T[]; queue: T[] };

const SLOT_COUNT = 3;

function replaceSkipped<T extends Suggestion>(
  { slots, queue }: SlotState<T>,
  id: number,
): SlotState<T> {
  const index = slots.findIndex(({ media }) => media.id === id);
  if (index < 0) return { slots, queue };

  const [next, ...rest] = queue;
  if (!next) {
    return { slots: slots.filter((_, slot) => slot !== index), queue };
  }

  return { slots: slots.with(index, next), queue: rest };
}

export function toMixtapeSlots<T extends Suggestion>(
  suggestions: ReadonlyArray<T>,
  skips: ReadonlyArray<number>,
): T[] {
  const opening = suggestions
    .slice(0, SLOT_COUNT)
    .toSorted((a, b) => b.match - a.match);

  const initial: SlotState<T> = {
    slots: opening,
    queue: suggestions.slice(SLOT_COUNT),
  };

  return skips.reduce((state, id) => replaceSkipped(state, id), initial).slots;
}

import { describe, expect, it } from 'vitest';
import { toMixtapeSlots } from './toMixtapeSlots.ts';

const suggestion = (id: number, match = 80) => ({ media: { id }, match });
const ids = (slots: ReadonlyArray<{ media: { id: number } }>) =>
  slots.map(({ media }) => media.id);

describe('toMixtapeSlots', () => {
  it('should deal the first three, best match first', () => {
    const slots = toMixtapeSlots(
      [suggestion(1, 78), suggestion(2, 87), suggestion(3, 76), suggestion(4)],
      [],
    );
    expect(ids(slots)).toEqual([2, 1, 3]);
  });

  it('should put the next suggestion in the skipped slot', () => {
    const slots = toMixtapeSlots([1, 2, 3, 4, 5].map((id) => suggestion(id)), [
      2,
    ]);
    expect(ids(slots)).toEqual([1, 4, 3]);
  });

  it('should keep replacing the same slot in order', () => {
    const slots = toMixtapeSlots([1, 2, 3, 4, 5].map((id) => suggestion(id)), [
      2,
      4,
    ]);
    expect(ids(slots)).toEqual([1, 5, 3]);
  });

  it('should drop a slot once the list runs out', () => {
    const slots = toMixtapeSlots([1, 2, 3].map((id) => suggestion(id)), [2]);
    expect(ids(slots)).toEqual([1, 3]);
  });

  it('should ignore skips that are not showing', () => {
    const slots = toMixtapeSlots([1, 2, 3, 4].map((id) => suggestion(id)), [
      9,
    ]);
    expect(ids(slots)).toEqual([1, 2, 3]);
  });
});

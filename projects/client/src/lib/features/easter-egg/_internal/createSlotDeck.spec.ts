import { describe, expect, it } from 'vitest';
import { createSlotDeck } from './createSlotDeck.ts';
import type { GameTitle } from './GameTitle.ts';

const title = (key: string, rating: number): GameTitle => ({
  key,
  title: key,
  type: 'movie',
  year: 2020,
  rating,
  poster: `https://example.com/${key}.jpg`,
});

const pool = [
  title('a', 90),
  title('b', 70),
  title('c', 50),
  title('d', 30),
];

const first = () => 0;

describe('util: createSlotDeck', () => {
  it('should open with three different titles', () => {
    const slots = createSlotDeck({ pool, random: first }).opening();
    const keys = slots.map((slot) => slot.title.key);

    expect(new Set(keys).size).toBe(3);
  });

  it('should give every slot a unique id', () => {
    const deck = createSlotDeck({ pool, random: first });
    const slots = deck.opening();
    const last = slots.at(-1);
    if (!last) throw new Error('expected an opening slot');

    const next = deck.draw({ after: last, streak: 1 });
    const ids = [...slots, next].map((slot) => slot.id);

    expect(new Set(ids).size).toBe(4);
  });

  it('should draw a title that was not used yet', () => {
    const deck = createSlotDeck({ pool, random: first });
    const slots = deck.opening();
    const last = slots.at(-1);
    if (!last) throw new Error('expected an opening slot');

    const next = deck.draw({ after: last, streak: 1 });

    expect(slots.map((slot) => slot.title.key)).not.toContain(next.title.key);
  });

  it('should open with nothing when the pool is empty', () => {
    expect(createSlotDeck({ pool: [], random: first }).opening()).toEqual([]);
  });
});

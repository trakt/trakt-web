import { describe, expect, it } from 'vitest';
import { toPickerItems } from './toPickerItems.ts';

const earth = { id: 1, title: 'In the Earth' };
const ritual = { id: 2, title: 'The Ritual' };
const coherence = { id: 3, title: 'Coherence' };
const spaceballs = { id: 4, title: 'Spaceballs' };
const history = [earth, ritual, coherence, spaceballs];

describe('toPickerItems', () => {
  it('should show the whole history in watch order before any pick', () => {
    const { kind, items } = toPickerItems({
      history,
      fitMedia: [],
      searchResults: [],
      picked: [],
      picks: [],
      fits: [],
      query: '',
    });

    expect(kind).toBe('recent');
    expect(items.map(({ media }) => media.id)).toEqual([1, 2, 3, 4]);
  });

  it('should lead with the picks in deck order, then the fits, best first', () => {
    const { kind, items } = toPickerItems({
      history,
      fitMedia: [],
      searchResults: [],
      picked: [earth, spaceballs],
      picks: [4, 1],
      fits: [
        { id: 3, score: 0.7 },
        { id: 2, score: 0.6 },
      ],
      query: '',
    });

    expect(kind).toBe('fits');
    expect(items.map(({ media, slot }) => [media.id, slot])).toEqual([
      [4, 1],
      [1, 2],
      [3, null],
      [2, null],
    ]);
  });

  it('should never offer a picked title among the fits', () => {
    const { items } = toPickerItems({
      history,
      fitMedia: [],
      searchResults: [],
      picked: [earth],
      picks: [1],
      fits: [
        { id: 1, score: 1 },
        { id: 2, score: 0.6 },
      ],
      query: '',
    });

    expect(items.map(({ media }) => media.id)).toEqual([1, 2]);
    expect(items.map(({ slot }) => slot)).toEqual([1, null]);
  });

  it('should skip a pick whose details have not arrived yet', () => {
    const { items } = toPickerItems({
      history,
      fitMedia: [],
      searchResults: [],
      picked: [],
      picks: [1],
      fits: [{ id: 2, score: 0.6 }],
      query: '',
    });

    expect(items.map(({ media }) => media.id)).toEqual([2]);
  });

  it('should keep a searched title that does not fit, marked off and listed last', () => {
    const { kind, items } = toPickerItems({
      history,
      fitMedia: [],
      searchResults: [],
      picked: [earth],
      picks: [1],
      fits: [{ id: 2, score: 0.6 }],
      query: ' E',
    });

    expect(kind).toBe('search');
    expect(items).toEqual([
      { media: earth, isOff: false, slot: 1 },
      { media: ritual, isOff: false, slot: null },
      { media: coherence, isOff: true, slot: null },
      { media: spaceballs, isOff: true, slot: null },
    ]);
  });

  it('should only keep the picks that match the typed text', () => {
    const { items } = toPickerItems({
      history,
      fitMedia: [],
      searchResults: [],
      picked: [earth, spaceballs],
      picks: [1, 4],
      fits: [],
      query: 'space',
    });

    expect(items).toEqual([{ media: spaceballs, isOff: false, slot: 2 }]);
  });

  it('should mark nothing off while searching with no picks', () => {
    const { items } = toPickerItems({
      history,
      fitMedia: [],
      searchResults: [],
      picked: [],
      picks: [],
      fits: [],
      query: 'space',
    });

    expect(items).toEqual([{ media: spaceballs, isOff: false, slot: null }]);
  });

  it('should add older search hits from the whole history after recent matches', () => {
    const gladiator = { id: 5, title: 'Gladiator' };
    const gladiatorTwo = { id: 6, title: 'Gladiator II' };
    const { kind, items } = toPickerItems({
      history: [...history, gladiatorTwo],
      fitMedia: [],
      searchResults: [gladiatorTwo, gladiator],
      picked: [earth],
      picks: [1],
      fits: [{ id: 5, score: 0.77 }],
      query: 'glad',
    });

    expect(kind).toBe('search');
    expect(items.map(({ media, isOff }) => [media.id, isOff])).toEqual([
      [5, false],
      [6, true],
    ]);
  });

  it('should show deeper fits from their fetched details in fit order', () => {
    const gladiator = { id: 5, title: 'Gladiator' };
    const { kind, items } = toPickerItems({
      history,
      fitMedia: [gladiator],
      searchResults: [],
      picked: [earth],
      picks: [1],
      fits: [
        { id: 2, score: 0.8 },
        { id: 5, score: 0.77 },
      ],
      query: '',
    });

    expect(kind).toBe('fits');
    expect(items.map(({ media }) => media.id)).toEqual([1, 2, 5]);
  });

  it('should drop full-history hits that no longer match the typed text', () => {
    const gladiator = { id: 5, title: 'Gladiator' };
    const { items } = toPickerItems({
      history,
      fitMedia: [],
      searchResults: [gladiator],
      picked: [],
      picks: [],
      fits: [],
      query: 'star',
    });

    expect(items).toEqual([]);
  });
});

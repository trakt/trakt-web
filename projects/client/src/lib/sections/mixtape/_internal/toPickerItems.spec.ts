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
      picks: [],
      fits: [],
      query: '',
    });

    expect(kind).toBe('recent');
    expect(items.map(({ media }) => media.id)).toEqual([1, 2, 3, 4]);
  });

  it('should show only fitting titles, best fit first, once something is picked', () => {
    const { kind, items } = toPickerItems({
      history,
      fitMedia: [],
      searchResults: [],
      picks: [1],
      fits: [{ id: 3, score: 0.7 }, { id: 2, score: 0.6 }],
      query: '',
    });

    expect(kind).toBe('fits');
    expect(items.map(({ media }) => media.id)).toEqual([3, 2]);
  });

  it('should never offer a title that is already picked', () => {
    const { items } = toPickerItems({
      history,
      fitMedia: [],
      searchResults: [],
      picks: [1],
      fits: [{ id: 1, score: 1 }, { id: 2, score: 0.6 }],
      query: '',
    });

    expect(items.map(({ media }) => media.id)).toEqual([2]);
  });

  it('should keep a searched title that does not fit, marked off and listed last', () => {
    const { kind, items } = toPickerItems({
      history,
      fitMedia: [],
      searchResults: [],
      picks: [1],
      fits: [{ id: 2, score: 0.6 }],
      query: ' E',
    });

    expect(kind).toBe('search');
    expect(items).toEqual([
      { media: ritual, isOff: false },
      { media: coherence, isOff: true },
      { media: spaceballs, isOff: true },
    ]);
  });

  it('should mark nothing off while searching with no picks', () => {
    const { items } = toPickerItems({
      history,
      fitMedia: [],
      searchResults: [],
      picks: [],
      fits: [],
      query: 'space',
    });

    expect(items).toEqual([{ media: spaceballs, isOff: false }]);
  });

  it('should add older search hits from the whole history after recent matches', () => {
    const gladiator = { id: 5, title: 'Gladiator' };
    const gladiatorTwo = { id: 6, title: 'Gladiator II' };
    const { kind, items } = toPickerItems({
      history: [...history, gladiatorTwo],
      fitMedia: [],
      searchResults: [gladiatorTwo, gladiator],
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
      picks: [1],
      fits: [{ id: 2, score: 0.8 }, { id: 5, score: 0.77 }],
      query: '',
    });

    expect(kind).toBe('fits');
    expect(items.map(({ media }) => media.id)).toEqual([2, 5]);
  });

  it('should drop full-history hits that no longer match the typed text', () => {
    const gladiator = { id: 5, title: 'Gladiator' };
    const { items } = toPickerItems({
      history,
      fitMedia: [],
      searchResults: [gladiator],
      picks: [],
      fits: [],
      query: 'star',
    });

    expect(items).toEqual([]);
  });
});

import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock.ts';
import { describe, expect, it } from 'vitest';
import { mapToShowEntry } from './mapToShowEntry.ts';

describe('mapToShowEntry', () => {
  it('should map a concluded ending', () => {
    const show = mapToShowEntry({
      ...ShowSiloResponseMock,
      ending: 'concluded',
    });

    expect(show.ending).toBe('concluded');
  });

  it('should map an open ending', () => {
    const show = mapToShowEntry({ ...ShowSiloResponseMock, ending: 'open' });

    expect(show.ending).toBe('open');
  });

  it('should omit the ending when it is null', () => {
    const show = mapToShowEntry({ ...ShowSiloResponseMock, ending: null });

    expect(show.ending).toBeUndefined();
  });

  it('should omit the ending when it is missing', () => {
    expect(mapToShowEntry(ShowSiloResponseMock).ending).toBeUndefined();
  });
});

import { describe, expect, it } from 'vitest';
import { toCollectionProviders } from './toCollectionProviders.ts';

describe('util: toCollectionProviders', () => {
  it('should map each id to the provider it was collected on', () => {
    const result = toCollectionProviders({
      '123': '2023-10-01T12:00:00.000Z|plex',
      '456': '2023-10-02T12:00:00.000Z|jellyfin',
    });

    expect(result).to.deep.equal({
      '123': ['plex'],
      '456': ['jellyfin'],
    });
  });

  it('should keep every provider when an id is on several', () => {
    const result = toCollectionProviders({
      '123': '2023-10-01T12:00:00.000Z|jellyfin,plex',
    });

    expect(result).to.deep.equal({ '123': ['jellyfin', 'plex'] });
  });

  it('should drop ids without a provider', () => {
    const result = toCollectionProviders({
      '123': '2023-10-01T12:00:00.000Z|plex',
      '456': '2023-10-02T12:00:00.000Z|',
      '789': '2023-10-03T12:00:00.000Z',
    });

    expect(result).to.deep.equal({ '123': ['plex'] });
  });

  it('should combine the providers of all episodes of a show', () => {
    const result = toCollectionProviders({
      '345': {
        '1': {
          '10': '2023-10-01T12:00:00.000Z|plex',
          '11': '2023-10-01T12:00:00.000Z|plex',
        },
        '2': {
          '20': '2023-10-01T12:00:00.000Z|jellyfin',
        },
      },
    });

    expect(result).to.deep.equal({ '345': ['plex', 'jellyfin'] });
  });

  it('should drop keys that are not valid ids', () => {
    const result = toCollectionProviders({
      '123': '2023-10-01T12:00:00.000Z|plex',
      message: 'something went wrong',
    });

    expect(result).to.deep.equal({ '123': ['plex'] });
  });

  it('should return no ids for an empty response', () => {
    expect(toCollectionProviders({})).to.deep.equal({});
    expect(toCollectionProviders(undefined)).to.deep.equal({});
  });
});

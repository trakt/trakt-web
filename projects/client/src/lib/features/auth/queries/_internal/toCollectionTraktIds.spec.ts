import { describe, expect, it } from 'vitest';
import { toCollectionTraktIds } from './toCollectionTraktIds.ts';

describe('util: toCollectionTraktIds', () => {
  it('should map the response keys to trakt ids', () => {
    const result = toCollectionTraktIds({
      '123': '2023-10-01T12:00:00.000Z',
      '456': '2023-10-02T12:00:00.000Z',
    });

    expect(result).to.deep.equal([123, 456]);
  });

  it('should return no ids for an empty response', () => {
    expect(toCollectionTraktIds({})).to.deep.equal([]);
    expect(toCollectionTraktIds(undefined)).to.deep.equal([]);
  });

  it('should drop keys that are not valid ids', () => {
    const result = toCollectionTraktIds({
      '123': '2023-10-01T12:00:00.000Z',
      message: 'something went wrong',
    });

    expect(result).to.deep.equal([123]);
  });
});

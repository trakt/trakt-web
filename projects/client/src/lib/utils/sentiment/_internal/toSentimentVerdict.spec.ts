import { describe, expect, it } from 'vitest';
import { toSentimentVerdict } from './toSentimentVerdict.ts';

describe('util: toSentimentVerdict', () => {
  it('should be positive when there are more pros than cons', () => {
    expect(toSentimentVerdict({ pros: ['a', 'b'], cons: ['c'] })).toBe(
      'positive',
    );
  });

  it('should be negative when there are more cons than pros', () => {
    expect(toSentimentVerdict({ pros: ['a'], cons: ['b', 'c'] })).toBe(
      'negative',
    );
  });

  it('should be mixed when they are even', () => {
    expect(toSentimentVerdict({ pros: ['a'], cons: ['b'] })).toBe('mixed');
  });
});

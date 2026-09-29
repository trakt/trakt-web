import { describe, expect, it } from 'vitest';
import { toSentimentAspects } from './toSentimentAspects.ts';

const pros = ['p1', 'p2', 'p3', 'p4', 'p5'];
const cons = ['c1', 'c2', 'c3', 'c4', 'c5'];

describe('util: toSentimentAspects', () => {
  it('should show only the pros when the sentiment is positive', () => {
    expect(toSentimentAspects({ pros, cons: ['c1'], limit: 4 })).toEqual({
      verdict: 'positive',
      pros: ['p1', 'p2', 'p3', 'p4'],
      cons: [],
    });
  });

  it('should show only the cons when the sentiment is negative', () => {
    expect(toSentimentAspects({ pros: ['p1'], cons, limit: 3 })).toEqual({
      verdict: 'negative',
      pros: [],
      cons: ['c1', 'c2', 'c3'],
    });
  });

  it('should split the limit evenly when the sentiment is mixed', () => {
    expect(toSentimentAspects({ pros, cons, limit: 4 })).toEqual({
      verdict: 'mixed',
      pros: ['p1', 'p2'],
      cons: ['c1', 'c2'],
    });
  });

  it('should round the split down for an odd limit', () => {
    expect(toSentimentAspects({ pros, cons, limit: 3 })).toEqual({
      verdict: 'mixed',
      pros: ['p1'],
      cons: ['c1'],
    });
  });
});

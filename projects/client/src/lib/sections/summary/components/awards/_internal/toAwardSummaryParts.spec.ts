import { describe, expect, it } from 'vitest';
import { toAwardSummaryParts } from './toAwardSummaryParts.ts';

describe('util: toAwardSummaryParts', () => {
  it('should bold the count of each ceremony', () => {
    expect(
      toAwardSummaryParts([
        {
          id: 'oscars',
          ceremony: 'oscars',
          kind: 'wins',
          wins: 7,
          nominations: 13,
        },
        {
          id: 'cannes',
          ceremony: 'cannes',
          kind: 'festival',
          wins: 1,
          nominations: 1,
        },
        {
          id: 'emmys',
          ceremony: 'emmys',
          kind: 'nominations',
          wins: 0,
          nominations: 2,
        },
      ]),
    ).to.deep.equal([
      {
        id: 'oscars',
        ceremony: 'oscars',
        kind: 'wins',
        message: '<b>7 Oscars</b> from 13 nominations',
      },
      {
        id: 'cannes',
        ceremony: 'cannes',
        kind: 'festival',
        message: "<b>Palme d'Or</b>",
      },
      {
        id: 'emmys',
        ceremony: 'emmys',
        kind: 'nominations',
        message: '<b>2 Emmy nominations</b>',
      },
    ]);
  });
});

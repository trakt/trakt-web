import { describe, expect, it } from 'vitest';
import { toSmartListAwardLabels } from './toSmartListAwardLabels.ts';

describe('util: toSmartListAwardLabels', () => {
  it('should label every award with its ceremony and short name', () => {
    const labels = toSmartListAwardLabels([
      {
        slug: 'oscars',
        name: 'Academy Awards',
        mediaTypes: ['movie'],
        awards: [
          {
            slug: 'oscars-achievement-in-casting',
            name: 'Academy Award for Achievement in Casting',
          },
          {
            slug: 'oscars-best-picture',
            name: 'Academy Award for Best Picture',
          },
        ],
      },
      {
        slug: 'cannes',
        name: 'Cannes Film Festival',
        mediaTypes: ['movie'],
        awards: [{ slug: 'palme-dor', name: "Palme d'Or" }],
      },
    ]);

    expect(labels.get('oscars-best-picture')).toEqual({
      ceremonySlug: 'oscars',
      ceremony: 'Academy Awards',
      name: 'Academy Award for Best Picture',
      shortName: 'Best Picture',
    });
    expect(labels.get('palme-dor')?.shortName).toBe("Palme d'Or");
  });
});

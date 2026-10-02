import { MediaReactionSchema } from '$lib/requests/models/MediaReaction.ts';
import { describe, expect, it } from 'vitest';
import { toMediaReactionDistribution } from './toMediaReactionDistribution.ts';

describe('util: toMediaReactionDistribution', () => {
  it('should give every media reaction a count', () => {
    const distribution = toMediaReactionDistribution({ fire: 2 });

    expect(Object.keys(distribution)).toEqual(MediaReactionSchema.options);
    expect(distribution.fire).toBe(2);
    expect(distribution.love).toBe(0);
  });

  it('should drop keys outside the media taxonomy', () => {
    expect(toMediaReactionDistribution({ laugh: 4 })).not.toHaveProperty(
      'laugh',
    );
  });
});

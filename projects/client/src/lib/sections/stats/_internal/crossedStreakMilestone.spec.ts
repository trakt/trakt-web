import { describe, expect, it } from 'vitest';
import { crossedStreakMilestone } from './crossedStreakMilestone.ts';

describe('util: crossedStreakMilestone', () => {
  it('should return the milestone the streak just reached', () => {
    expect(crossedStreakMilestone(6, 7)).toBe(7);
    expect(crossedStreakMilestone(29, 30)).toBe(30);
    expect(crossedStreakMilestone(99, 100)).toBe(100);
    expect(crossedStreakMilestone(364, 365)).toBe(365);
  });

  it('should stay quiet when the streak jumps by more than a day', () => {
    expect(crossedStreakMilestone(5, 7)).toBeNull();
    expect(crossedStreakMilestone(5, 31)).toBeNull();
    expect(crossedStreakMilestone(0, 30)).toBeNull();
  });

  it('should stay quiet between milestones', () => {
    expect(crossedStreakMilestone(7, 8)).toBeNull();
    expect(crossedStreakMilestone(3, 4)).toBeNull();
  });

  it('should stay quiet when the streak holds or drops', () => {
    expect(crossedStreakMilestone(7, 7)).toBeNull();
    expect(crossedStreakMilestone(30, 0)).toBeNull();
  });
});

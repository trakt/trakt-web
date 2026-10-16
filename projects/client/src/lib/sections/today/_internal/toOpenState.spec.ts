import { describe, expect, it } from 'vitest';
import type { TodayStoryGroup } from '../models/TodayStoryGroup.ts';
import { toOpenState } from './toOpenState.ts';

const first: TodayStoryGroup = { key: 'first', type: 'for-you', frames: [] };
const second: TodayStoryGroup = { key: 'second', type: 'for-you', frames: [] };

describe('toOpenState', () => {
  it('should be unseen when no story was seen', () => {
    expect(toOpenState({ groups: [first, second], seenStories: {} }))
      .toBe('unseen');
  });

  it('should be unseen when only some stories were seen', () => {
    expect(toOpenState({ groups: [first, second], seenStories: { first: 1 } }))
      .toBe('unseen');
  });

  it('should be seen when every story was seen', () => {
    expect(
      toOpenState({
        groups: [first, second],
        seenStories: { first: 1, second: 1 },
      }),
    ).toBe('seen');
  });
});

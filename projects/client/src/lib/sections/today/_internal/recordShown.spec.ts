import { describe, expect, it } from 'vitest';
import { NOTHING_SHOWN } from './NOTHING_SHOWN.ts';
import { recordShown } from './recordShown.ts';

describe('recordShown', () => {
  it('should count each group and frame once however often it is shown', () => {
    const shown = [
      { groupKey: 'a', frameKey: 'a-1' },
      { groupKey: 'a', frameKey: 'a-2' },
      { groupKey: 'a', frameKey: 'a-1' },
      { groupKey: 'b', frameKey: 'b-1' },
    ].reduce(recordShown, NOTHING_SHOWN);

    expect(shown.groups.size).toBe(2);
    expect(shown.frames.size).toBe(3);
  });

  it('should leave the previous record untouched', () => {
    recordShown(NOTHING_SHOWN, { groupKey: 'a', frameKey: 'a-1' });

    expect(NOTHING_SHOWN.groups.size).toBe(0);
    expect(NOTHING_SHOWN.frames.size).toBe(0);
  });
});

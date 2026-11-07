import { time } from '$lib/utils/timing/time.ts';
import { describe, expect, it } from 'vitest';
import { watchingNowPollInterval } from './watchingNowPollInterval.ts';

const queryWithUpdates = (dataUpdateCount: number) => ({
  state: { dataUpdateCount },
});

describe('util: watchingNowPollInterval', () => {
  it('should poll every two minutes before the first response', () => {
    expect(watchingNowPollInterval(queryWithUpdates(0))).toBe(
      time.minutes(2),
    );
  });

  it('should keep polling below the session cap', () => {
    expect(watchingNowPollInterval(queryWithUpdates(29))).toBe(
      time.minutes(2),
    );
  });

  it('should stop polling once the session cap is reached', () => {
    expect(watchingNowPollInterval(queryWithUpdates(30))).toBe(false);
  });
});

import { Environment } from '@trakt/api';
import { describe, expect, it } from 'vitest';
import { calendarFeedEnvironment } from './calendarFeedEnvironment.ts';

describe('util: calendarFeedEnvironment', () => {
  it('should swap the private production host for the public one', () => {
    expect(calendarFeedEnvironment(Environment.production_private)).toBe(
      Environment.production,
    );
  });

  it('should keep every other environment as is', () => {
    expect(calendarFeedEnvironment(Environment.production)).toBe(
      Environment.production,
    );
    expect(calendarFeedEnvironment(Environment.staging)).toBe(
      Environment.staging,
    );
  });
});

import { Environment } from '@trakt/api';
import { describe, expect, it } from 'vitest';
import { calendarFeedOrigin } from './calendarFeedOrigin.ts';

describe('util: calendarFeedOrigin', () => {
  it('should serve production feeds from trakt.tv', () => {
    expect(calendarFeedOrigin(Environment.production_private)).toBe(
      'https://trakt.tv',
    );
    expect(calendarFeedOrigin(Environment.production)).toBe(
      'https://trakt.tv',
    );
  });

  it('should keep the staging api host on staging', () => {
    expect(calendarFeedOrigin(Environment.staging)).toBe(
      Environment.staging,
    );
  });
});

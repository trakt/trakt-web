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

  it('should keep the api host for non-production environments', () => {
    expect(calendarFeedOrigin(Environment.staging)).toBe(
      Environment.staging,
    );
    expect(calendarFeedOrigin(Environment.development)).toBe(
      Environment.development,
    );
  });
});

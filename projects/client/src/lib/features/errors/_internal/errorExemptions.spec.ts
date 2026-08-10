import { describe, expect, it } from 'vitest';
import { WellKnownErrorType } from '../models/WellKnownErrors.ts';
import { isErrorExempt } from './errorExemptions.ts';

const PLEX_ROUTE = '/settings/plex';
const PLEX_ACCOUNTS_SOURCE = 'query:plexServerAccounts';

describe('isErrorExempt', () => {
  it('should return false without an error or route', () => {
    expect(isErrorExempt(undefined, PLEX_ROUTE)).toBe(false);
    expect(
      isErrorExempt({ type: WellKnownErrorType.ServerError }, null),
    ).toBe(false);
  });

  it('should exempt route-wide entries regardless of source', () => {
    expect(
      isErrorExempt(
        { type: WellKnownErrorType.ServerError },
        '/settings/streaming-services',
      ),
    ).toBe(true);
  });

  it('should exempt plex server-accounts failures on the plex settings route', () => {
    for (
      const type of [
        WellKnownErrorType.ServerError,
        WellKnownErrorType.NotFoundError,
      ]
    ) {
      expect(
        isErrorExempt({ type, source: PLEX_ACCOUNTS_SOURCE }, PLEX_ROUTE),
      ).toBe(true);
    }
  });

  it('should not exempt other failing queries on the plex settings route', () => {
    expect(
      isErrorExempt(
        {
          type: WellKnownErrorType.ServerError,
          source: 'query:plexSettings',
        },
        PLEX_ROUTE,
      ),
    ).toBe(false);
    expect(
      isErrorExempt({ type: WellKnownErrorType.ServerError }, PLEX_ROUTE),
    ).toBe(false);
  });

  it('should not exempt source-scoped errors on other routes', () => {
    expect(
      isErrorExempt(
        {
          type: WellKnownErrorType.ServerError,
          source: PLEX_ACCOUNTS_SOURCE,
        },
        '/settings/general',
      ),
    ).toBe(false);
  });

  it('should not exempt error types without an exemption', () => {
    expect(
      isErrorExempt(
        {
          type: WellKnownErrorType.RateLimitError,
          source: PLEX_ACCOUNTS_SOURCE,
        },
        PLEX_ROUTE,
      ),
    ).toBe(false);
  });
});

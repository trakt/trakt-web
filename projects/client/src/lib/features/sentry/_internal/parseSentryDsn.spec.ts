import { describe, expect, it } from 'vitest';
import { parseSentryDsn } from './parseSentryDsn.ts';

describe('util: parseSentryDsn', () => {
  it('should extract host and project id from a regional DSN', () => {
    expect(
      parseSentryDsn(
        'https://7c03bc5bf58eb8ceb23801702a91954f@o4509870904639488.ingest.de.sentry.io/4509870926463056',
      ),
    ).toEqual({
      host: 'o4509870904639488.ingest.de.sentry.io',
      projectId: '4509870926463056',
    });
  });

  it('should extract host and project id from a non-regional DSN', () => {
    expect(parseSentryDsn('https://key@o1.ingest.sentry.io/42')).toEqual({
      host: 'o1.ingest.sentry.io',
      projectId: '42',
    });
  });

  it('should return null when the project id is missing', () => {
    expect(parseSentryDsn('https://key@o1.ingest.sentry.io')).toBeNull();
  });

  it('should return null for a malformed url', () => {
    expect(parseSentryDsn('not-a-dsn')).toBeNull();
  });

  it('should return null for an empty string', () => {
    expect(parseSentryDsn('')).toBeNull();
  });
});

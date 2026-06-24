import { describe, expect, it } from 'vitest';
import { isWorkerAuthHost } from './isWorkerAuthHost.ts';

describe('isWorkerAuthHost', () => {
  it('is true for the worker beta host', () => {
    expect(isWorkerAuthHost('trakt-web.trakt.workers.dev')).toBe(true);
  });

  it('is true for any workers.dev host', () => {
    expect(isWorkerAuthHost('preview-123.trakt.workers.dev')).toBe(true);
  });

  it('is false for the prod app host', () => {
    expect(isWorkerAuthHost('app.trakt.tv')).toBe(false);
  });

  it('is false for localhost', () => {
    expect(isWorkerAuthHost('localhost')).toBe(false);
  });

  it('is false for a lookalike that does not end in .workers.dev', () => {
    expect(isWorkerAuthHost('workers.dev.evil.com')).toBe(false);
  });

  it('is false when the hostname is missing', () => {
    expect(isWorkerAuthHost(undefined)).toBe(false);
    expect(isWorkerAuthHost(null)).toBe(false);
  });
});

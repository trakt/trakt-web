import { describe, expect, it } from 'vitest';
import { splitEventPayload } from './splitEventPayload.ts';

describe('util: splitEventPayload', () => {
  it('should route allowlisted numeric keys to metrics', () => {
    const { dims, metrics } = splitEventPayload({
      source: 'tvtime',
      totalItems: 120,
      duration: 4200,
    });

    expect(metrics).toEqual({ totalItems: 120, duration: 4200 });
    expect(dims).toEqual({ source: 'tvtime' });
  });

  it('should keep a non-allowlisted number as a dim', () => {
    const { dims, metrics } = splitEventPayload({ position: 3 });

    expect(metrics).toEqual({});
    expect(dims).toEqual({ position: '3' });
  });

  it('should keep an allowlisted key sent as a string as a dim', () => {
    const { dims, metrics } = splitEventPayload({ rating: '8' });

    expect(metrics).toEqual({});
    expect(dims).toEqual({ rating: '8' });
  });

  it('should keep a dim named after an Object prototype key', () => {
    const { dims } = splitEventPayload({ constructor: 'sidebar' });

    expect(dims).toEqual({ constructor: 'sidebar' });
  });

  it('should keep a non-finite number as a dim rather than a metric', () => {
    const { dims, metrics } = splitEventPayload({ duration: Number.NaN });

    expect(metrics).toEqual({});
    expect(dims).toEqual({ duration: 'NaN' });
  });
});

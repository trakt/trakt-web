import { describe, expect, it } from 'vitest';
import { ReportError } from '../models/ReportError.ts';
import { mapToReportError } from './mapToReportError.ts';

describe('mapToReportError', () => {
  it('maps 409 to AlreadyReported', () => {
    expect(mapToReportError(409)).toBe(ReportError.AlreadyReported);
  });

  it('maps 429 to RateLimited', () => {
    expect(mapToReportError(429)).toBe(ReportError.RateLimited);
  });

  it.each([400, 401, 403, 404, 422, 500, 502, 503])(
    'maps %i to Unknown',
    (status) => {
      expect(mapToReportError(status)).toBe(ReportError.Unknown);
    },
  );
});

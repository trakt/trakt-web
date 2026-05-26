import type { PeakHoursBucket } from '$lib/sections/stats/_internal/models/PeakHoursBucket.ts';

export type PeakHoursData = {
  readonly buckets: ReadonlyArray<PeakHoursBucket>;
};

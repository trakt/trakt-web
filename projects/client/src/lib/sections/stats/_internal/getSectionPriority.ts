import type { PulseItem } from '$lib/sections/stats/_internal/models/PulseItem.ts';

export function getSectionPriority(entry: PulseItem): number {
  if (entry.type === 'graph' && entry.key === 'screenTimeDaily') return 0;
  if (entry.type === 'stat' && entry.key === 'avgPerDay') return 1;
  if (entry.type === 'graph' && entry.key === 'peakHours') return 2;
  if (entry.type === 'stat' && entry.key === 'screenTimeTotal') return 3;
  if (entry.type === 'stat' && entry.key === 'screenTimeShare') return 4;

  return 100;
}

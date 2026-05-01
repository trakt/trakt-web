import { assertDefined } from '$lib/utils/assert/assertDefined.ts';

export function getLastWatchedAt(timestamps: string[]): Date {
  const lastWatchedAt = assertDefined(
    timestamps.toSorted().at(-1),
    'Expected at least one timestamp',
  );

  return new Date(lastWatchedAt);
}

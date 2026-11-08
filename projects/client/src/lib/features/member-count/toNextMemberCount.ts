import type { RegisteredMemberCount } from '$lib/requests/models/RegisteredMemberCount.ts';

const MEMBER_COUNT_WHEN_UNAVAILABLE = 17_000_000;

type NextMemberCountParams = {
  current: number | null;
  data: RegisteredMemberCount | Nil;
  status: 'pending' | 'error' | 'success';
};

export function toNextMemberCount({
  current,
  data,
  status,
}: NextMemberCountParams): number | null {
  if (data) return Math.max(current ?? 0, data.total);
  if (status === 'pending') return current;

  return current ?? MEMBER_COUNT_WHEN_UNAVAILABLE;
}

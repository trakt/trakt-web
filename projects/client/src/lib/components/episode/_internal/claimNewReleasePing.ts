import { time } from '$lib/utils/timing/time.ts';

const STORAGE_KEY = 'trakt-new-release-pings';
const PING_MEMORY = time.days(7);

type ClaimNewReleasePingParams = {
  key: string;
  storage: Pick<Storage, 'getItem' | 'setItem'>;
  now: number;
};

function readPings(storage: ClaimNewReleasePingParams['storage']) {
  try {
    const parsed: unknown = JSON.parse(storage.getItem(STORAGE_KEY) ?? '{}');
    return parsed && typeof parsed === 'object'
      ? parsed as Record<string, number>
      : {};
  } catch {
    return {};
  }
}

export function claimNewReleasePing(
  { key, storage, now }: ClaimNewReleasePingParams,
): boolean {
  const recent = Object.fromEntries(
    Object.entries(readPings(storage)).filter(([, playedAt]) =>
      now - playedAt < PING_MEMORY
    ),
  );

  if (key in recent) return false;

  storage.setItem(STORAGE_KEY, JSON.stringify({ ...recent, [key]: now }));
  return true;
}

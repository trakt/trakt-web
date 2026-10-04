import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { error } from '$lib/utils/console/print.ts';
import { time } from '$lib/utils/timing/time.ts';
import { pickDailyEntry } from './pickDailyEntry.ts';

type SlugStore = {
  get: (key: string) => Promise<{ text: () => Promise<string> } | null>;
  put: (key: string, value: string) => Promise<unknown>;
};

type ResolveTrendingSlugProps = {
  type: MediaType;
  date: Date;
  now: Date;
  bucket: SlugStore | Nil;
  fetchSlugs: () => Promise<ReadonlyArray<string>>;
};

type FindRecentPickProps = {
  type: MediaType;
  now: Date;
  bucket: SlugStore;
};

const LOOKBACK_DAYS = 7;

const toDay = (date: Date) => date.toISOString().slice(0, 10);

const toKey = (type: MediaType, day: string) =>
  `images/share/trending/${type}/${day}.txt`;

const readPick = async (bucket: SlugStore | Nil, key: string) => {
  const stored = await bucket?.get(key);
  return stored ? await stored.text() : undefined;
};

async function findRecentPick({ type, now, bucket }: FindRecentPickProps) {
  const days = Array.from(
    { length: LOOKBACK_DAYS },
    (_, index) => toDay(new Date(now.getTime() - time.days(index + 1))),
  );
  const picks = await Promise.all(
    days.map((day) => readPick(bucket, toKey(type, day))),
  );

  return picks.find(Boolean);
}

export async function resolveTrendingSlug(
  props: ResolveTrendingSlugProps,
): Promise<string | undefined> {
  const { type, date, now, bucket, fetchSlugs } = props;
  const day = toDay(date);
  const key = toKey(type, day);

  const stored = await readPick(bucket, key);
  if (stored) return stored;

  if (day !== toDay(now)) {
    return resolveTrendingSlug({ ...props, date: now });
  }

  const entries = await fetchSlugs().catch((e: unknown) => {
    error('Failed to fetch trending media:', e);
    return [];
  });
  const slug = pickDailyEntry({ entries, date });

  if (!bucket) return slug;
  if (!slug) return findRecentPick({ type, now, bucket });

  await bucket.put(key, slug).catch((e: unknown) => {
    error('Failed to store the trending pick:', e);
  });
  return slug;
}

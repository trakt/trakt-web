import type { ShareType } from '$lib/features/share/models/ShareType.ts';
import { time } from '$lib/utils/timing/time.ts';

const SETTLE_PERIOD = time.days(7);

const SHAPES = {
  cover: 'feed',
  story: 'story',
  og: 'open-graph',
} as const satisfies Record<string, ShareType>;

type MirShape = keyof typeof SHAPES;

type ParseMirShareParamsProps = {
  slug: string;
  searchParams: URLSearchParams;
  now: Date;
};

type MirShareParams = {
  slug: string;
  year: number;
  month: number;
  shape: MirShape;
  shareType: ShareType;
  isSettled: boolean;
  settlesAt: Date;
  hasExplicitMonth: boolean;
};

function isShape(value: string): value is MirShape {
  return value in SHAPES;
}

function toMonthIndex(year: number, month: number) {
  return year * 12 + (month - 1);
}

function toNumber(value: string | null) {
  return value && /^\d+$/.test(value) ? Number(value) : null;
}

export function parseMirShareParams({
  slug,
  searchParams,
  now,
}: ParseMirShareParamsProps): MirShareParams | null {
  if (!/^[\w-]+$/.test(slug)) return null;

  const currentIndex = toMonthIndex(
    now.getUTCFullYear(),
    now.getUTCMonth() + 1,
  );
  const previousIndex = currentIndex - 1;

  const year =
    toNumber(searchParams.get('year')) ?? Math.floor(previousIndex / 12);
  const month = toNumber(searchParams.get('month')) ?? (previousIndex % 12) + 1;
  const shape = searchParams.get('shape') ?? 'cover';

  if (month < 1 || month > 12) return null;
  if (year < 2000) return null;
  if (!isShape(shape)) return null;

  const monthIndex = toMonthIndex(year, month);
  if (monthIndex >= currentIndex) return null;

  const settlesAt = new Date(Date.UTC(year, month, 1) + SETTLE_PERIOD);

  return {
    slug,
    year,
    month,
    shape,
    shareType: SHAPES[shape],
    isSettled: now.getTime() >= settlesAt.getTime(),
    settlesAt,
    hasExplicitMonth: searchParams.has('year') && searchParams.has('month'),
  };
}

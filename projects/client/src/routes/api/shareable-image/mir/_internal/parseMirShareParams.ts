import { isShareSlug } from '$lib/features/share/isShareSlug.ts';
import type { ShareType } from '$lib/features/share/models/ShareType.ts';
import { time } from '$lib/utils/timing/time.ts';
import { parseShareShape } from '../../_internal/parseShareShape.ts';

const SETTLE_PERIOD = time.days(7);

type ParseMirShareParamsProps = {
  slug: string;
  searchParams: URLSearchParams;
  now: Date;
};

type MirShareParams = {
  slug: string;
  year: number;
  month: number;
  shape: string;
  shareType: ShareType;
  isSettled: boolean;
  settlesAt: Date;
  hasExplicitMonth: boolean;
};

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
  if (!isShareSlug(slug)) return null;

  const currentIndex = toMonthIndex(
    now.getUTCFullYear(),
    now.getUTCMonth() + 1,
  );
  const previousIndex = currentIndex - 1;

  const year =
    toNumber(searchParams.get('year')) ?? Math.floor(previousIndex / 12);
  const month = toNumber(searchParams.get('month')) ?? (previousIndex % 12) + 1;
  const parsedShape = parseShareShape(searchParams.get('shape'));

  if (month < 1 || month > 12) return null;
  if (year < 2000) return null;
  if (!parsedShape) return null;

  const monthIndex = toMonthIndex(year, month);
  if (monthIndex >= currentIndex) return null;

  const settlesAt = new Date(Date.UTC(year, month, 1) + SETTLE_PERIOD);

  return {
    slug,
    year,
    month,
    ...parsedShape,
    isSettled: now.getTime() >= settlesAt.getTime(),
    settlesAt,
    hasExplicitMonth: searchParams.has('year') && searchParams.has('month'),
  };
}

import { isShareSlug } from '$lib/features/share/isShareSlug.ts';
import type { ShareType } from '$lib/features/share/models/ShareType.ts';
import { getYearInReviewYear } from '$lib/utils/date/getYearInReviewYear.ts';
import { time } from '$lib/utils/timing/time.ts';
import { parseShareShape } from '../../_internal/parseShareShape.ts';

const FIRST_PERSONA_YEAR = 2026;
const SETTLE_PERIOD = time.days(7);

type ParseYirShareParamsProps = {
  slug: string;
  searchParams: URLSearchParams;
  now: Date;
};

type YirShareParams = {
  slug: string;
  year: number;
  shape: string;
  shareType: ShareType;
  isSettled: boolean;
  settlesAt: Date;
  hasExplicitYear: boolean;
};

function toNumber(value: string | null) {
  return value && /^\d+$/.test(value) ? Number(value) : null;
}

export function parseYirShareParams({
  slug,
  searchParams,
  now,
}: ParseYirShareParamsProps): YirShareParams | null {
  if (!isShareSlug(slug)) return null;

  const year = toNumber(searchParams.get('year')) ?? getYearInReviewYear(now);
  const parsedShape = parseShareShape(searchParams.get('shape'));

  if (!parsedShape) return null;
  if (year < FIRST_PERSONA_YEAR) return null;
  if (year > now.getUTCFullYear()) return null;

  const settlesAt = new Date(Date.UTC(year + 1, 0, 1) + SETTLE_PERIOD);

  return {
    slug,
    year,
    ...parsedShape,
    isSettled: now.getTime() >= settlesAt.getTime(),
    settlesAt,
    hasExplicitYear: searchParams.has('year'),
  };
}

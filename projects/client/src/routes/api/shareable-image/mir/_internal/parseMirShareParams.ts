import { isShareSlug } from '$lib/features/share/isShareSlug.ts';
import type { ShareType } from '$lib/features/share/models/ShareType.ts';

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
  isPastMonth: boolean;
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
  if (!isShareSlug(slug)) return null;

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

  return {
    slug,
    year,
    month,
    shape,
    shareType: SHAPES[shape],
    isPastMonth: monthIndex < currentIndex,
  };
}

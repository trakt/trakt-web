import { getLocale } from '$lib/features/i18n/index.ts';
import { getMonthKey } from '$lib/utils/date/getMonthKey.ts';
import { getPreviousMonth } from '$lib/utils/date/getPreviousMonth.ts';
import { getStartOfWeek } from '$lib/utils/date/getStartOfWeek.ts';
import { isFirstWeekOfMonth } from '$lib/utils/date/isFirstWeekOfMonth.ts';
import { map } from 'rxjs';
import { getEndOfYear } from '../../../utils/date/getEndOfYear.ts';
import { isInDateRange } from '../../../utils/date/isInDateRange.ts';
import { MIR_BANNER_ID } from '../month-in-review/constants/index.ts';
import { YIR_BANNER_ID } from '../year-in-review/constants/index.ts';
import { useBannerDismissal } from './useBannerDismissal.ts';

function isInYirRange(date: Date) {
  const isFirstMonth = date.getMonth() === 0;

  const dec24 = new Date(date.getFullYear(), 11, 24);
  const startOfWeek = getStartOfWeek(dec24, getLocale());
  const endOfYear = getEndOfYear(date);
  const isPastChristmasWeek = isInDateRange(date, startOfWeek, endOfYear);

  return isFirstMonth || isPastChristmasWeek;
}

// FIXME: switch to proper timing like seasonal themes and promotions
export function useReviewBanners(date: Date) {
  const previousMonth = getPreviousMonth(date);
  const year = previousMonth.getFullYear();

  const { isDismissed: isMirDismissed, dismiss: dismissMir } =
    useBannerDismissal(MIR_BANNER_ID, getMonthKey(date));
  const { isDismissed: isYirDismissed, dismiss: dismissYir } =
    useBannerDismissal(YIR_BANNER_ID, `${year}`);

  const hasMir = isMirDismissed.pipe(
    map((isDismissed) => isFirstWeekOfMonth(date) && !isDismissed),
  );

  const hasYir = isYirDismissed.pipe(
    map((isDismissed) => isInYirRange(date) && !isDismissed),
  );

  return {
    mir: hasMir.pipe(
      map((isVisible) => ({
        isVisible,
        dismiss: dismissMir,
        month: previousMonth,
      })),
    ),
    yir: hasYir.pipe(
      map((isVisible) => ({
        isVisible,
        dismiss: dismissYir,
        year,
      })),
    ),
  };
}

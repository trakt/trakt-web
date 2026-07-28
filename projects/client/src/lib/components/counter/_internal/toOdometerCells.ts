import { getIntlLocale } from '$lib/features/i18n/index.ts';
import type { AvailableLanguage } from '$lib/features/i18n/index.ts';

export type OdometerCell =
  // `place` is the power of ten this column renders, so a cell derives its own
  // roll offset from the raw value without being told its digit.
  | { kind: 'digit'; place: number }
  | { kind: 'separator'; text: string };

/**
 * Split a number into odometer columns. Grouping comes from `formatToParts`, so
 * `1,234,567`, `1.234.567`, and the Indic `12,34,567` all lay out correctly.
 */
export function toOdometerCells(
  { value, locale }: { value: number; locale: string },
): OdometerCell[] {
  const parts = new Intl.NumberFormat(
    getIntlLocale(locale as AvailableLanguage),
    { maximumFractionDigits: 0 },
  ).formatToParts(Math.floor(Math.max(0, value)));

  const digitCount = parts
    .filter((part) => part.type === 'integer')
    .reduce((total, part) => total + part.value.length, 0);

  return parts.reduce<{ cells: OdometerCell[]; place: number }>(
    ({ cells, place }, part) => {
      if (part.type !== 'integer') {
        return {
          place,
          cells: [...cells, { kind: 'separator', text: part.value }],
        };
      }

      return {
        place: place - part.value.length,
        cells: [
          ...cells,
          ...[...part.value].map((_, index) => ({
            kind: 'digit' as const,
            place: place - 1 - index,
          })),
        ],
      };
    },
    { cells: [], place: digitCount },
  ).cells;
}

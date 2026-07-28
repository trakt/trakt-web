import { getIntlLocale } from '$lib/features/i18n/index.ts';
import type { AvailableLanguage } from '$lib/features/i18n/index.ts';

type OdometerCell =
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

  // Digits split per character so each gets its own column; anything else stays
  // whole, since a separator is one cell however many characters it is.
  const chars = parts.flatMap((part) =>
    part.type === 'integer'
      ? [...part.value].map((char) => ({ char, isDigit: true }))
      : [{ char: part.value, isDigit: false }]
  );

  return chars.map(({ char, isDigit }, index) =>
    isDigit
      // A digit's place is however many digits follow it.
      ? {
        kind: 'digit',
        place: chars.slice(index + 1).filter((entry) => entry.isDigit).length,
      }
      : { kind: 'separator', text: char }
  );
}

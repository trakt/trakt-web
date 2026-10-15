import { afterEach, describe, expect, it, vi } from 'vitest';
import { toUnitFormatter } from './toUnitFormatter.ts';

const NumberFormat = Intl.NumberFormat;

function mockUnitStyle(
  unitFormat: (locale?: string, options?: Intl.NumberFormatOptions) => unknown,
) {
  vi.spyOn(Intl, 'NumberFormat').mockImplementation(
    function (locale?: string, options?: Intl.NumberFormatOptions) {
      if (options?.style === 'unit') {
        return unitFormat(locale, options);
      }

      return new NumberFormat(locale, options);
    } as unknown as typeof Intl.NumberFormat,
  );
}

describe('util: toUnitFormatter', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should format with the unit style when supported', () => {
    const format = toUnitFormatter({
      locale: 'en',
      unit: 'minute',
      suffix: 'm',
      options: { unitDisplay: 'long' },
    });

    expect(format(5)).toBe('5 minutes');
  });

  it('should fall back when the unit style is rejected', () => {
    mockUnitStyle(() => {
      throw new RangeError(
        'Value unit out of range for Intl.NumberFormat options property style',
      );
    });

    const format = toUnitFormatter({ locale: 'en', unit: 'hour', suffix: 'h' });

    expect(format(3)).toBe('3h');
  });

  it('should fall back when formatting throws', () => {
    mockUnitStyle(() => ({
      format: () => {
        throw new TypeError('Internal error. Icu error.');
      },
    }));

    const format = toUnitFormatter({ locale: 'en', unit: 'day', suffix: 'd' });

    expect(format(2)).toBe('2d');
  });

  it('should keep the number options in the fallback', () => {
    mockUnitStyle(() => {
      throw new RangeError('unsupported');
    });

    const format = toUnitFormatter({
      locale: 'en',
      unit: 'meter',
      suffix: ' m',
      options: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
    });

    expect(format(1.5)).toBe('1.50 m');
  });
});

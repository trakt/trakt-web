import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { toHumanDuration } from './toHumanDuration.ts';

describe('toHumanDuration', () => {
  it('should clamp at hours and display 300m as 5h', () => {
    expect(toHumanDuration({ minutes: 300, clampAt: 'hour' })).toBe('5h');
  });

  it('should clamp at hours and display 1440m as 1d', () => {
    expect(toHumanDuration({ minutes: 1440, clampAt: 'hour' })).toBe('1d');
  });

  it('should clamp at hours and display 1500m as 1d 1h', () => {
    expect(toHumanDuration({ minutes: 1500, clampAt: 'hour' })).toBe('1d 1h');
  });

  it('should clamp at days and display 2880m as 2d', () => {
    expect(toHumanDuration({ minutes: 2880, clampAt: 'day' })).toBe('2d');
  });

  it('should clamp at days and display 3000m as 2d', () => {
    expect(toHumanDuration({ minutes: 3000, clampAt: 'day' })).toBe('2d');
  });

  it('should clamp at days and display 3600m as 2d', () => {
    expect(toHumanDuration({ minutes: 3600, clampAt: 'day' })).toBe('2d');
  });

  it('should clamp at hours and display 2880m as 2d', () => {
    expect(toHumanDuration({ minutes: 2880, clampAt: 'hour' })).toBe('2d');
  });

  it('should clamp at hours and display 2881m as 2d', () => {
    expect(toHumanDuration({ minutes: 2881, clampAt: 'hour' })).toBe('2d');
  });

  it('should clamp at hours and display 59m as 59m', () => {
    expect(toHumanDuration({ minutes: 59, clampAt: 'hour' })).toBe('59m');
  });

  it('should clamp at hours and display 61m as 1h', () => {
    expect(toHumanDuration({ minutes: 61, clampAt: 'hour' })).toBe('1h');
  });

  it('should clamp at days and display 1439m as 23h 59m', () => {
    expect(toHumanDuration({ minutes: 1439, clampAt: 'day' })).toBe('23h 59m');
  });

  it('should clamp at days and display 23h as 23h', () => {
    expect(toHumanDuration({ hours: 23, clampAt: 'day' })).toBe('23h');
  });

  it('should return a human readable duration', () => {
    expect(toHumanDuration({ days: 1, hours: 2, minutes: 3 })).toBe('1d 2h 3m');
  });

  it('should display 300m as 5h', () => {
    expect(toHumanDuration({ minutes: 300 })).toBe('5h');
  });

  it('should display 1440m as 1d', () => {
    expect(toHumanDuration({ minutes: 1440 })).toBe('1d');
  });

  it('should display 1441m as 1d 1m', () => {
    expect(toHumanDuration({ minutes: 1441 })).toBe('1d 1m');
  });

  it('should display 1500m as 1d 1h', () => {
    expect(toHumanDuration({ minutes: 1500 })).toBe('1d 1h');
  });

  it('should display 1501m as 1d 1h 1m', () => {
    expect(toHumanDuration({ minutes: 1501 })).toBe('1d 1h 1m');
  });

  it('should display 1530m as 1d 1h 30m', () => {
    expect(toHumanDuration({ minutes: 1530 })).toBe('1d 1h 30m');
  });

  it('should display 1501m as 1d', () => {
    expect(toHumanDuration({ minutes: 1501, clampAt: 'day' })).toBe('1d');
  });

  it('should display 1530m as 1d', () => {
    expect(toHumanDuration({ minutes: 1530, clampAt: 'day' })).toBe('1d');
  });

  it('should return empty string when all parts are 0', () => {
    expect(toHumanDuration({})).toBe('');
  });

  it('should use a custom separator', () => {
    expect(toHumanDuration({ minutes: 1530, separator: ', ' })).toBe(
      '1d, 1h, 30m',
    );
  });

  it('should use a custom unit display units', () => {
    expect(toHumanDuration({ minutes: 1530, unitDisplay: 'long' })).toBe(
      '1 day 1 hour 30 minutes',
    );
  });

  describe('when the unit style is unsupported', () => {
    const NumberFormat = Intl.NumberFormat;

    beforeEach(() => {
      vi.spyOn(Intl, 'NumberFormat').mockImplementation(
        function (locale?: string, options?: Intl.NumberFormatOptions) {
          if (options?.style === 'unit') {
            throw new RangeError(
              'Value unit out of range for Intl.NumberFormat options property style',
            );
          }

          return new NumberFormat(locale, options);
        } as unknown as typeof Intl.NumberFormat,
      );
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should fall back to a plain number with a suffix', () => {
      expect(toHumanDuration({ minutes: 1530 })).toBe('1d 1h 30m');
    });

    it('should keep honouring the separator', () => {
      expect(toHumanDuration({ minutes: 1530, separator: ', ' })).toBe(
        '1d, 1h, 30m',
      );
    });

    it('should keep clamping', () => {
      expect(toHumanDuration({ minutes: 300, clampAt: 'hour' })).toBe('5h');
    });
  });
});

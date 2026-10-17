import { describe, expect, it } from 'vitest';
import { createNumberFormatCache } from './createNumberFormatCache.ts';

describe('util: createNumberFormatCache', () => {
  it('should reuse one formatter per locale', () => {
    const getFormatter = createNumberFormatCache({ maximumFractionDigits: 0 });

    expect(getFormatter('en-US')).toBe(getFormatter('en-US'));
    expect(getFormatter('en-US')).not.toBe(getFormatter('de-DE'));
  });

  it('should format with the given options', () => {
    const getFormatter = createNumberFormatCache({ style: 'percent' });

    expect(getFormatter('en-US').format(0.5)).toBe('50%');
  });
});

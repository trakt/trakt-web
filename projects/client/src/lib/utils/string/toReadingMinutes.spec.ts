import { describe, expect, it } from 'vitest';
import { toReadingMinutes } from './toReadingMinutes.ts';

const words = (count: number) => Array.from({ length: count }, () => 'word');

describe('util: toReadingMinutes', () => {
  it('should read nothing as one minute', () => {
    expect(toReadingMinutes([])).toBe(1);
  });

  it('should round a short text up to one minute', () => {
    expect(toReadingMinutes([words(40).join(' ')])).toBe(1);
  });

  it('should round up to the next whole minute', () => {
    expect(toReadingMinutes([words(201).join(' ')])).toBe(2);
  });

  it('should count the words across every text', () => {
    expect(toReadingMinutes([words(150).join(' '), words(150).join(' ')])).toBe(
      2,
    );
  });

  it('should ignore extra whitespace', () => {
    expect(toReadingMinutes(['  one \n\n two  '])).toBe(1);
  });
});

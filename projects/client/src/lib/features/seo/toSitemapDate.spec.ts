import { describe, expect, it } from 'vitest';
import { toSitemapDate } from './toSitemapDate.ts';

describe('util: toSitemapDate', () => {
  it('should format the date as a UTC calendar day', () => {
    expect(toSitemapDate(new Date('2026-09-23T23:59:59Z'))).to.equal(
      '2026-09-23',
    );
  });
});

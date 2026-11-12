import { describe, expect, it } from 'vitest';
import { resolveSummaryCardLayout } from './resolveSummaryCardLayout.ts';

describe('util: resolveSummaryCardLayout', () => {
  it('should keep the compact layout on any screen', () => {
    expect(
      resolveSummaryCardLayout({ style: 'compact', isLargeScreen: true }),
    ).toBe('compact');
  });

  it('should keep the minimal layout on any screen', () => {
    expect(
      resolveSummaryCardLayout({ style: 'minimal', isLargeScreen: false }),
    ).toBe('minimal');
  });

  it('should use the large layout on large screens', () => {
    expect(
      resolveSummaryCardLayout({ style: 'summary', isLargeScreen: true }),
    ).toBe('large');
  });

  it('should use the default layout on small screens', () => {
    expect(
      resolveSummaryCardLayout({ style: 'summary', isLargeScreen: false }),
    ).toBe('default');
  });
});

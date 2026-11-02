import { describe, expect, it } from 'vitest';
import { toHumanTimeAgo } from './toHumanTimeAgo.ts';

const NOW = new Date('2026-10-05T12:00:00.000Z');

describe('toHumanTimeAgo', () => {
  it('describes minutes in the past', () => {
    expect(
      toHumanTimeAgo(NOW, new Date('2026-10-05T11:55:00.000Z'), 'en'),
    ).toBe('5 minutes ago');
  });

  it('describes days in the past', () => {
    expect(
      toHumanTimeAgo(NOW, new Date('2026-10-03T12:00:00.000Z'), 'en'),
    ).toBe('2 days ago');
  });

  it('localizes the result', () => {
    expect(
      toHumanTimeAgo(NOW, new Date('2026-10-05T11:55:00.000Z'), 'nl-NL'),
    ).toBe('5 minuten geleden');
  });
});

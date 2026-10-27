import * as m from '$lib/features/i18n/messages.ts';
import { MAX_DATE } from '$lib/utils/constants.ts';
import { describe, expect, it } from 'vitest';
import { toStorySeasonMeta } from './toStorySeasonMeta.ts';

const season = (airDate: Date, count = 10) => ({
  airDate,
  episodes: { count, aired: count },
});

describe('util: toStorySeasonMeta', () => {
  it('should be null without a season', () => {
    expect(toStorySeasonMeta(undefined)).toBeNull();
    expect(toStorySeasonMeta(null)).toBeNull();
  });

  it('should pair the air year with the episode count', () => {
    const meta = toStorySeasonMeta(season(new Date('2022-02-18T00:00:00Z')));

    expect(meta).toBe(
      m.text_recap_meta_pair({
        first: '2022',
        second: m.tag_text_number_of_episodes({ count: 10 }),
      }),
    );
  });

  it('should only show the episode count for an unannounced date', () => {
    expect(toStorySeasonMeta(season(MAX_DATE, 8))).toBe(
      m.tag_text_number_of_episodes({ count: 8 }),
    );
  });

  it('should only show the episode count for an unknown date', () => {
    expect(toStorySeasonMeta(season(new Date(0), 6))).toBe(
      m.tag_text_number_of_episodes({ count: 6 }),
    );
  });
});

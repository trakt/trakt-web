import type { YouTubeSpecial } from '$lib/requests/models/YouTubeSpecial.ts';
import { describe, expect, it } from 'vitest';
import { mapToYouTubeSpecialOption } from './mapToYouTubeSpecialOption.ts';

const officialSpecial: YouTubeSpecial = {
  videoId: 'dQw4w9WgXcQ',
  title: 'Some Comedian: Live',
  channel: 'Some Comedian',
  durationSeconds: 3600,
  source: 'official',
  link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
};

describe('util: mapToYouTubeSpecialOption', () => {
  it('should mark an official upload', () => {
    const result = mapToYouTubeSpecialOption(officialSpecial);

    expect(result).to.deep.equal({
      key: 'youtube-special',
      type: 'youtube-special',
      source: 'youtube',
      link: officialSpecial.link,
      isOfficial: true,
    });
  });

  it('should mark an unofficial upload', () => {
    const result = mapToYouTubeSpecialOption({
      ...officialSpecial,
      source: 'unofficial',
    });

    expect(result?.isOfficial).to.equal(false);
  });

  it('should return null when there is no YouTube special', () => {
    expect(mapToYouTubeSpecialOption(null)).to.equal(null);
    expect(mapToYouTubeSpecialOption(undefined)).to.equal(null);
  });
});

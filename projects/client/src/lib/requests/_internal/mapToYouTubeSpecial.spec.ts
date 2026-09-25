import type { YouTubeSpecialResponse } from '../models/YouTubeSpecialResponse.ts';
import { describe, expect, it } from 'vitest';
import { mapToYouTubeSpecial } from './mapToYouTubeSpecial.ts';

const baseResponse: YouTubeSpecialResponse = {
  videoId: 'dQw4w9WgXcQ',
  title: 'Some Comedian: Live',
  channel: 'Some Comedian',
};

describe('util: mapToYouTubeSpecial', () => {
  it('should default the source to official when absent', () => {
    const result = mapToYouTubeSpecial(baseResponse);

    expect(result?.source).to.equal('official');
  });

  it('should map an official upload', () => {
    const result = mapToYouTubeSpecial({ ...baseResponse, source: 'official' });

    expect(result).to.deep.equal({
      videoId: baseResponse.videoId,
      title: baseResponse.title,
      channel: baseResponse.channel,
      durationSeconds: undefined,
      source: 'official',
      link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    });
  });

  it('should map an unofficial upload', () => {
    const result = mapToYouTubeSpecial({
      ...baseResponse,
      source: 'unofficial',
    });

    expect(result?.source).to.equal('unofficial');
  });

  it('should return null when the response is absent', () => {
    expect(mapToYouTubeSpecial(undefined)).to.equal(null);
  });
});

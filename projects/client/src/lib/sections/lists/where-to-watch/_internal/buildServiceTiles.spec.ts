import type { LibraryOption } from '../models/LibraryOption.ts';
import type { StreamNow } from '$lib/requests/models/StreamingServiceOptions.ts';
import type { YouTubeSpecialOption } from '../models/YouTubeSpecialOption.ts';
import { describe, expect, it } from 'vitest';
import { buildServiceTiles } from './buildServiceTiles.ts';

const streamingService: StreamNow = {
  link: 'https://netflix.com',
  source: 'netflix',
  is4k: true,
  type: 'streaming',
  key: 'streaming-netflix',
};

const plexService: LibraryOption = {
  key: 'library-plex',
  type: 'library',
  source: 'plex',
  link: 'https://app.plex.tv/desktop',
};

const youtubeTile: YouTubeSpecialOption = {
  key: 'youtube-special',
  type: 'youtube-special',
  source: 'youtube',
  link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  isOfficial: true,
};

describe('util: buildServiceTiles', () => {
  it('should put the YouTube tile first, ahead of streaming services', () => {
    const result = buildServiceTiles({
      justWatchServices: [streamingService],
      plexServices: [],
      youtubeTile,
      isMobile: false,
    });

    expect(result).to.deep.equal([youtubeTile, streamingService]);
  });

  it('should put the YouTube tile first, ahead of the Plex library tile', () => {
    const result = buildServiceTiles({
      justWatchServices: [streamingService],
      plexServices: [plexService],
      youtubeTile,
      isMobile: true,
    });

    expect(result).to.deep.equal([youtubeTile, plexService, streamingService]);
  });

  it('should omit the YouTube tile when there is no link', () => {
    const result = buildServiceTiles({
      justWatchServices: [streamingService],
      plexServices: [],
      youtubeTile: null,
      isMobile: false,
    });

    expect(result).to.deep.equal([streamingService]);
  });

  it('should only include Plex services on mobile', () => {
    const result = buildServiceTiles({
      justWatchServices: [streamingService],
      plexServices: [plexService],
      youtubeTile: null,
      isMobile: false,
    });

    expect(result).to.deep.equal([streamingService]);
  });
});

import type { MediaReactionSummary } from '$lib/requests/models/MediaReactionSummary.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { ReactionSentimentSchema } from '$lib/requests/models/ReactionSentiment.ts';

/*
  Stand-in for an endpoint that does not exist yet.

  Seeded off the media key rather than randomised, so a title's numbers are the
  same on every render, every reload and every machine - a prototype whose
  counts shuffle under you is impossible to judge, and impossible to screenshot
  twice.
*/

type SummaryParams = {
  mediaType: MediaType;
  mediaId: string;
};

function seedFrom(value: string): number {
  return Array.from(value).reduce(
    (accumulator, character) =>
      (accumulator * 31 + character.charCodeAt(0)) >>> 0,
    7,
  );
}

function createSeededRandom(seed: number): () => number {
  let state = seed || 1;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

export const mediaReactionsMock = {
  summary({ mediaType, mediaId }: SummaryParams): MediaReactionSummary {
    const rng = createSeededRandom(seedFrom(`${mediaType}:${mediaId}`));

    const metrics = ReactionSentimentSchema.options.map((sentiment) => ({
      sentiment,
      count: 4 + Math.floor(rng() * 320),
      hasReacted: false,
    }));

    const totalCount = metrics.reduce((sum, metric) => sum + metric.count, 0);

    return { totalCount, metrics };
  },
};

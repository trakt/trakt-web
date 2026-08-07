import { ReactionSentimentSchema } from '$lib/requests/models/ReactionSentiment.ts';
import { describe, expect, it } from 'vitest';
import { mediaReactionsMock } from './mediaReactionsMock.ts';

describe('util: mediaReactionsMock', () => {
  describe('summary', () => {
    it('should return one metric per sentiment in the taxonomy', () => {
      const summary = mediaReactionsMock.summary({
        mediaType: 'movie',
        mediaId: 'heretic-2024',
      });

      expect(summary.metrics.map((metric) => metric.sentiment)).toEqual(
        ReactionSentimentSchema.options,
      );
    });

    it('should report a total count equal to the sum of metric counts', () => {
      const summary = mediaReactionsMock.summary({
        mediaType: 'show',
        mediaId: 'severance',
      });

      const sum = summary.metrics.reduce(
        (accumulator, metric) => accumulator + metric.count,
        0,
      );

      expect(summary.totalCount).toBe(sum);
    });

    it('should be deterministic for the same media', () => {
      const first = mediaReactionsMock.summary({
        mediaType: 'movie',
        mediaId: 'dune-part-two',
      });
      const second = mediaReactionsMock.summary({
        mediaType: 'movie',
        mediaId: 'dune-part-two',
      });

      expect(first).toEqual(second);
    });

    it('should vary counts between different media', () => {
      const first = mediaReactionsMock.summary({
        mediaType: 'movie',
        mediaId: 'dune-part-two',
      });
      const second = mediaReactionsMock.summary({
        mediaType: 'show',
        mediaId: 'the-bear',
      });

      expect(first.totalCount).not.toBe(second.totalCount);
    });
  });

  describe('forum', () => {
    it('should tag every post with the requested sentiment', () => {
      const forum = mediaReactionsMock.forum({
        mediaType: 'movie',
        mediaId: 'heretic-2024',
        sentiment: 'vomit',
      });

      expect(forum.sentiment).toBe('vomit');
      expect(forum.posts.length).toBeGreaterThan(0);
      expect(forum.posts.every((post) => post.sentiment === 'vomit')).toBe(
        true,
      );
    });
  });
});

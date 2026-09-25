import { REACTIONS_CODE_MAP } from '$lib/components/reactions/reactionCodeMap.ts';
import { describe, expect, it } from 'vitest';
import { mediaReactionsMock } from './mediaReactionsMock.ts';

describe('util: mediaReactionsMock', () => {
  describe('summary', () => {
    it('should return a count for every reaction in the taxonomy', () => {
      const summary = mediaReactionsMock.summary({
        mediaType: 'movie',
        mediaId: 'heretic-2024',
      });

      expect(Object.keys(summary.distribution)).toEqual(
        Object.keys(REACTIONS_CODE_MAP),
      );
    });

    it('should report a total count equal to the sum of the distribution', () => {
      const summary = mediaReactionsMock.summary({
        mediaType: 'show',
        mediaId: 'severance',
      });

      const sum = Object.values(summary.distribution).reduce(
        (accumulator, count) => accumulator + count,
        0,
      );

      expect(summary.totalCount).toBe(sum);
    });

    it('should lead the preview with the most used reactions', () => {
      const summary = mediaReactionsMock.summary({
        mediaType: 'movie',
        mediaId: 'heretic-2024',
      });

      const counts = summary.top.map((reaction) =>
        summary.distribution[reaction]
      );

      expect(summary.top.length).toBe(3);
      expect([...counts].sort((a, b) => b - a)).toEqual(counts);
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
});

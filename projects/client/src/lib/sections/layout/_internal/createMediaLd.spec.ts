import { toTranslatedGenre } from '$lib/utils/formatting/string/toTranslatedGenre.ts';
import { describe, expect, it } from 'vitest';
import { createMediaLd } from './createMediaLd.ts';
import type { MediaInfo } from './MediaInfo.ts';

const HERETIC: MediaInfo = {
  overview: 'Two young missionaries are forced to prove their faith.',
  runtime: 111,
  year: 2024,
  genres: ['horror', 'thriller'],
  rating: 0.7437,
  votes: 18847,
  certification: 'R',
};

const parse = (json: string) => JSON.parse(json);

const createMovieLd = (info: MediaInfo) =>
  parse(createMediaLd({
    type: 'movie',
    title: 'Heretic',
    url: 'https://app.trakt.tv/movies/heretic-2024',
    description: 'Two young missionaries are forced to prove their faith.',
    image: 'https://media.trakt.tv/heretic.webp',
    info,
  }));

describe('util: createMediaLd', () => {
  describe('movie: Heretic (2024)', () => {
    it('should describe the movie', () => {
      expect(createMovieLd(HERETIC)).to.deep.equal({
        '@context': 'https://schema.org',
        '@type': 'Movie',
        name: 'Heretic',
        description: 'Two young missionaries are forced to prove their faith.',
        image: 'https://media.trakt.tv/heretic.webp',
        url: 'https://app.trakt.tv/movies/heretic-2024',
        datePublished: '2024',
        genre: [toTranslatedGenre('horror'), toTranslatedGenre('thriller')],
        duration: 'PT111M',
        contentRating: 'R',
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '7.4',
          ratingCount: 18847,
          bestRating: '10',
          worstRating: '1',
        },
      });
    });
  });

  describe('aggregate rating', () => {
    it('should scale the normalized rating onto the 1-10 schema range', () => {
      const { aggregateRating } = createMovieLd({ ...HERETIC, rating: 0.8154 });

      expect(aggregateRating.ratingValue).to.equal('8.2');
    });

    it('should scale a perfect rating to the best rating', () => {
      const { aggregateRating } = createMovieLd({ ...HERETIC, rating: 1 });

      expect(aggregateRating.ratingValue).to.equal('10.0');
      expect(aggregateRating.bestRating).to.equal('10');
    });

    it('should scale the lowest rating onto the worst rating', () => {
      const { aggregateRating } = createMovieLd({ ...HERETIC, rating: 0.1 });

      expect(aggregateRating.ratingValue).to.equal('1.0');
      expect(aggregateRating.worstRating).to.equal('1');
    });

    it('should be omitted when there are no votes', () => {
      expect(createMovieLd({ ...HERETIC, votes: undefined }))
        .to.not.have.property('aggregateRating');
    });

    it('should be omitted when there is no rating', () => {
      expect(createMovieLd({ ...HERETIC, rating: null }))
        .to.not.have.property('aggregateRating');
    });
  });

  describe('show: Silo', () => {
    it('should describe the show', () => {
      const showLd = parse(createMediaLd({
        type: 'show',
        title: 'Silo',
        url: 'https://app.trakt.tv/shows/silo',
        description: 'Thousands live in a giant silo deep underground.',
        image: 'https://media.trakt.tv/silo.webp',
        info: {
          overview: 'Thousands live in a giant silo deep underground.',
          year: 2023,
          genres: ['drama'],
          rating: 0.8154,
          votes: 20254,
        },
      }));

      expect(showLd).to.deep.equal({
        '@context': 'https://schema.org',
        '@type': 'TVSeries',
        name: 'Silo',
        description: 'Thousands live in a giant silo deep underground.',
        image: 'https://media.trakt.tv/silo.webp',
        url: 'https://app.trakt.tv/shows/silo',
        datePublished: '2023',
        genre: [toTranslatedGenre('drama')],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '8.2',
          ratingCount: 20254,
          bestRating: '10',
          worstRating: '1',
        },
      });
    });
  });

  describe('episode: Silo - Freedom Day', () => {
    it('should describe the episode', () => {
      const episodeLd = parse(createMediaLd({
        type: 'episode',
        title: 'Freedom Day',
        url: 'https://app.trakt.tv/shows/silo/seasons/1/episodes/1',
        description: "Sheriff Becker's plans are thrown off course.",
        image: 'https://media.trakt.tv/freedom-day.webp',
        info: {
          overview: "Sheriff Becker's plans are thrown off course.",
          rating: 0.7753,
        },
      }));

      expect(episodeLd).to.deep.equal({
        '@context': 'https://schema.org',
        '@type': 'TVEpisode',
        name: 'Freedom Day',
        description: "Sheriff Becker's plans are thrown off course.",
        image: 'https://media.trakt.tv/freedom-day.webp',
        url: 'https://app.trakt.tv/shows/silo/seasons/1/episodes/1',
      });
    });
  });
});

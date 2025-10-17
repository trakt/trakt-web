import { setLocale } from '$lib/features/i18n/index.ts';
import { EpisodeSiloTranslationsMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloTranslationsMappedMock.ts';
import { MovieHereticTranslationsMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticTranslationsMappedMock.ts';
import { ShowSiloTranslationsMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloTranslationsMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { findRegionalIntl } from './findRegionalIntl.ts';

describe('util: findRegionalIntl', () => {
  describe('movie media type', () => {
    const movieTranslations = Array.from(
      MovieHereticTranslationsMappedMock.values(),
    );
    const fallbackData = {
      title: 'Fallback Title',
      overview: 'Fallback overview',
      tagline: 'Fallback tagline',
    };

    it('should return english translation for en-us locale', () => {
      setLocale('en');

      const result = findRegionalIntl({
        type: 'movie',
        translations: movieTranslations,
        fallback: fallbackData,
      });

      expect(result).to.deep.equal({
        ...MovieHereticTranslationsMappedMock.get('en'),
        title: fallbackData.title,
      });
    });

    it('should return portuguese translation for pt-br locale', () => {
      setLocale('pt-br');

      const result = findRegionalIntl({
        type: 'movie',
        translations: movieTranslations,
        fallback: fallbackData,
      });

      expect(result).to.deep.equal(
        MovieHereticTranslationsMappedMock.get('pt'),
      );
    });

    it('should return dutch translation for nl locale', () => {
      setLocale('nl-nl');

      const result = findRegionalIntl({
        type: 'movie',
        translations: movieTranslations,
        fallback: fallbackData,
      });

      expect(result).to.deep.equal({
        ...MovieHereticTranslationsMappedMock.get('nl'),
        title: fallbackData.title,
        tagline: fallbackData.tagline,
      });
    });

    it('should return fallback data for unsupported locale', () => {
      setLocale('fr-fr');

      const result = findRegionalIntl({
        type: 'movie',
        translations: movieTranslations,
        fallback: fallbackData,
      });

      expect(result).to.deep.equal({
        title: fallbackData.title,
        overview: fallbackData.overview,
        tagline: fallbackData.tagline,
        country: '',
      });
    });
  });

  describe('show media type', () => {
    const showTranslations = Array.from(
      ShowSiloTranslationsMappedMock.values(),
    );
    const fallbackData = {
      title: 'Fallback Show Title',
      overview: 'Fallback show overview',
      tagline: 'Fallback show tagline',
    };

    it('should return english translation for en-us locale', () => {
      setLocale('en');

      const result = findRegionalIntl({
        type: 'show',
        translations: showTranslations,
        fallback: fallbackData,
      });

      expect(result).to.deep.equal(ShowSiloTranslationsMappedMock.get('en'));
    });

    it('should return dutch translation for nl locale', () => {
      setLocale('nl-nl');

      const result = findRegionalIntl({
        type: 'show',
        translations: showTranslations,
        fallback: fallbackData,
      });

      expect(result).to.deep.equal({
        ...ShowSiloTranslationsMappedMock.get('nl'),
        title: fallbackData.title,
      });
    });

    it('should return japanese translation for ja locale', () => {
      setLocale('ja-jp');

      const result = findRegionalIntl({
        type: 'show',
        translations: showTranslations,
        fallback: fallbackData,
      });

      expect(result).to.deep.equal(ShowSiloTranslationsMappedMock.get('ja'));
    });
  });

  describe('episode media type', () => {
    const episodeTranslations = Array.from(
      EpisodeSiloTranslationsMappedMock.values(),
    );
    const fallbackData = {
      title: 'Fallback Episode Title',
      overview: 'Fallback episode overview',
    };

    it('should return english translation for en-us locale', () => {
      setLocale('en');

      const result = findRegionalIntl({
        type: 'episode',
        translations: episodeTranslations,
        fallback: fallbackData,
      });

      expect(result).to.deep.equal(EpisodeSiloTranslationsMappedMock.get('en'));
    });

    it('should return dutch translation for nl locale', () => {
      setLocale('nl-nl');

      const result = findRegionalIntl({
        type: 'episode',
        translations: episodeTranslations,
        fallback: fallbackData,
      });

      expect(result).to.deep.equal(EpisodeSiloTranslationsMappedMock.get('nl'));
    });
  });
});

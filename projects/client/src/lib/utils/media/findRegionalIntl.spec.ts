import { setLocale } from '$lib/features/i18n/index.ts';
import type { EpisodeIntl } from '$lib/requests/models/EpisodeIntl.ts';
import type { MediaIntl } from '$lib/requests/models/MediaIntl.ts';
import { EpisodeSiloTranslationsMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloTranslationsMappedMock.ts';
import { MovieHereticTranslationsMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticTranslationsMappedMock.ts';
import { ShowSiloTranslationsMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloTranslationsMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { findRegionalIntl } from './findRegionalIntl.ts';

function omitLanguage<T extends MediaIntl | EpisodeIntl>(intl: T | undefined) {
  if (!intl) return intl;
  const { language: _language, ...rest } = intl;
  return rest;
}

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
        ...omitLanguage(MovieHereticTranslationsMappedMock.get('en')),
        title: fallbackData.title,
      });
    });

    it('should return portuguese translation for pt-br locale', () => {
      setLocale('pt-BR');

      const result = findRegionalIntl({
        type: 'movie',
        translations: movieTranslations,
        fallback: fallbackData,
      });

      expect(result).to.deep.equal(
        omitLanguage(MovieHereticTranslationsMappedMock.get('pt')),
      );
    });

    it('should return dutch translation for nl locale', () => {
      setLocale('nl-NL');

      const result = findRegionalIntl({
        type: 'movie',
        translations: movieTranslations,
        fallback: fallbackData,
      });

      expect(result).to.deep.equal({
        ...omitLanguage(MovieHereticTranslationsMappedMock.get('nl')),
        title: fallbackData.title,
        tagline: fallbackData.tagline,
      });
    });

    it('should return fallback data for unsupported locale', () => {
      setLocale('fr-FR');

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

    it('should borrow title from a same-language sibling when the regional translation has it null', () => {
      setLocale('es-ES');

      const translations: MediaIntl[] = [
        {
          country: 'mx',
          language: 'es',
          title: 'Sunshine: Alerta solar',
          overview: 'Spanish (MX) overview.',
          tagline: 'Si el sol muere, nosotros también.',
        },
        {
          country: 'es',
          language: 'es',
          title: null,
          overview: 'Spanish (ES) overview.',
          tagline: null,
        },
      ];

      const result = findRegionalIntl({
        type: 'movie',
        translations,
        fallback: fallbackData,
      });

      expect(result).to.deep.equal({
        title: 'Sunshine: Alerta solar',
        overview: 'Spanish (ES) overview.',
        tagline: 'Si el sol muere, nosotros también.',
        country: 'es',
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

      expect(result).to.deep.equal(
        omitLanguage(ShowSiloTranslationsMappedMock.get('en')),
      );
    });

    it('should return dutch translation for nl locale', () => {
      setLocale('nl-NL');

      const result = findRegionalIntl({
        type: 'show',
        translations: showTranslations,
        fallback: fallbackData,
      });

      expect(result).to.deep.equal({
        ...omitLanguage(ShowSiloTranslationsMappedMock.get('nl')),
        title: fallbackData.title,
      });
    });

    it('should return japanese translation for ja locale', () => {
      setLocale('ja-JP');

      const result = findRegionalIntl({
        type: 'show',
        translations: showTranslations,
        fallback: fallbackData,
      });

      expect(result).to.deep.equal(
        omitLanguage(ShowSiloTranslationsMappedMock.get('ja')),
      );
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

      expect(result).to.deep.equal(
        omitLanguage(EpisodeSiloTranslationsMappedMock.get('en')),
      );
    });

    it('should return dutch translation for nl locale', () => {
      setLocale('nl-NL');

      const result = findRegionalIntl({
        type: 'episode',
        translations: episodeTranslations,
        fallback: fallbackData,
      });

      expect(result).to.deep.equal(
        omitLanguage(EpisodeSiloTranslationsMappedMock.get('nl')),
      );
    });
  });
});

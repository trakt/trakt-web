import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { MAX_DATE } from '$lib/utils/constants.ts';
import { EpisodeSiloMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloMappedMock.ts';
import { EpisodeSiloPeopleMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloPeopleMappedMock.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { MovieHereticPeopleMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticPeopleMappedMock.ts';
import { MovieHereticStudiosMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticStudiosMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { ShowSiloPeopleMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloPeopleMappedMock.ts';
import { ShowSiloStudiosMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloStudiosMappedMock.ts';
import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import MediaDetails from './MediaDetails.svelte';
import type { MediaDetailsProps } from './MediaDetailsProps.ts';

describe('MediaDetails', () => {
  const mediaTests = (props: MediaDetailsProps & { type: MediaType }) => {
    it('should display the media details sections', () => {
      render(
        MediaDetails,
        { props },
      );

      const premieredLabel = screen.getByText('Premiered');
      const runtimeLabel = screen.getByText('Runtime');
      const writerLabel = screen.getByText('Writer');
      const countryLabel = screen.getByText('Country');
      const languageLabel = screen.getByText('Language');
      const studioLabel = screen.getByText('Studio');
      const genreLabel = screen.getByText('Genre');

      expect(premieredLabel).toBeInTheDocument();
      expect(runtimeLabel).toBeInTheDocument();
      expect(writerLabel).toBeInTheDocument();
      expect(countryLabel).toBeInTheDocument();
      expect(languageLabel).toBeInTheDocument();
      expect(studioLabel).toBeInTheDocument();
      expect(genreLabel).toBeInTheDocument();
    });

    it('should distinguish upcoming items', () => {
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);

      render(
        MediaDetails,
        {
          props: {
            ...props,
            media: {
              ...props.media,
              airDate: nextYear,
            },
          },
        },
      );

      const premiereLabel = screen.getByText('Expected Premiere');
      expect(premiereLabel).toBeInTheDocument();
    });

    it('should show the status if there is no known year for an item', () => {
      render(
        MediaDetails,
        {
          props: {
            ...props,
            media: {
              ...props.media,
              year: undefined,
              airDate: MAX_DATE,
            },
          },
        },
      );

      const statusLabel = screen.getByText('Status');
      const premieredLabel = screen.queryByText('Premiered');

      expect(statusLabel).toBeInTheDocument();
      expect(premieredLabel).not.toBeInTheDocument();
    });

    it('should hide undefined values', () => {
      render(
        MediaDetails,
        {
          props: {
            ...props,
            media: {
              ...props.media,
              country: undefined,
            },
          },
        },
      );

      const countryLabel = screen.queryByText('Country');
      expect(countryLabel).not.toBeInTheDocument();
    });
  };

  describe('for a movie', () => {
    const defaultProps: MediaDetailsProps = {
      media: MovieHereticMappedMock,
      studios: MovieHereticStudiosMappedMock,
      crew: MovieHereticPeopleMappedMock,
      type: 'movie',
    };

    mediaTests(defaultProps);

    it('should display the director instead of creator', () => {
      render(
        MediaDetails,
        { props: defaultProps },
      );

      const directorLabel = screen.getByText('Director');
      const creatorLabel = screen.queryByText('Creator');

      expect(directorLabel).toBeInTheDocument();
      expect(creatorLabel).not.toBeInTheDocument();
    });
  });

  describe('for a show', () => {
    const defaultProps: MediaDetailsProps = {
      media: ShowSiloMappedMock,
      studios: ShowSiloStudiosMappedMock,
      crew: ShowSiloPeopleMappedMock,
      type: 'show',
    };

    mediaTests(defaultProps);

    it('should display the creator instead of director', () => {
      render(
        MediaDetails,
        {
          props: defaultProps,
        },
      );

      const directorLabel = screen.queryByText('Director');
      const creatorLabel = screen.getByText('Creator');

      expect(directorLabel).not.toBeInTheDocument();
      expect(creatorLabel).toBeInTheDocument();
    });
  });

  describe('for an episode', () => {
    const defaultProps: MediaDetailsProps = {
      episode: EpisodeSiloMappedMock,
      crew: EpisodeSiloPeopleMappedMock,
      type: 'episode',
    };

    it('should display the episode details', () => {
      render(
        MediaDetails,
        {
          props: defaultProps,
        },
      );

      const directorLabel = screen.getByText('Director');
      const creatorLabel = screen.queryByText('Creator');
      const airedLabel = screen.getByText('Aired');
      const runtimeLabel = screen.getByText('Runtime');

      expect(directorLabel).toBeInTheDocument();
      expect(creatorLabel).not.toBeInTheDocument();
      expect(airedLabel).toBeInTheDocument();
      expect(runtimeLabel).toBeInTheDocument();
    });

    it('should distinguish upcoming items', () => {
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);

      render(
        MediaDetails,
        {
          props: {
            ...defaultProps,
            episode: {
              ...defaultProps.episode,
              airDate: nextYear,
            },
          },
        },
      );

      const airsLabel = screen.getByText('Airs');
      expect(airsLabel).toBeInTheDocument();
    });
  });
});

import { MAX_DATE } from '$lib/utils/constants';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock';
import { MovieHereticPeopleMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticPeopleMappedMock';
import { MovieHereticStudiosMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticStudiosMappedMock';
import MediaDetails, { type MediaDetailsProps } from './MediaDetails.svelte';

import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

describe('MediaDetails', () => {
  const defaultProps: MediaDetailsProps = {
    media: MovieHereticMappedMock,
    studios: MovieHereticStudiosMappedMock,
    crew: MovieHereticPeopleMappedMock,
  };

  it('should display the media details sections', () => {
    render(
      MediaDetails,
      {
        props: {
          ...defaultProps,
        },
      },
    );

    const premieredLabel = screen.getByText('Premiered');
    const runtimeLabel = screen.getByText('Runtime');
    const directorLabel = screen.getByText('Director');
    const writerLabel = screen.getByText('Writer');
    const countryLabel = screen.getByText('Country');
    const languageLabel = screen.getByText('Language');
    const studioLabel = screen.getByText('Studio');
    const genreLabel = screen.getByText('Genre');

    expect(premieredLabel).toBeInTheDocument();
    expect(runtimeLabel).toBeInTheDocument();
    expect(directorLabel).toBeInTheDocument();
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
          ...defaultProps,
          media: {
            ...defaultProps.media,
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
          ...defaultProps,
          media: {
            ...defaultProps.media,
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
          ...defaultProps,
          media: {
            ...defaultProps.media,
            country: undefined,
          },
        },
      },
    );

    const countryLabel = screen.queryByText('Country');
    expect(countryLabel).not.toBeInTheDocument();
  });
});

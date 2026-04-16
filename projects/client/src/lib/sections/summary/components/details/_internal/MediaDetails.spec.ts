import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { MAX_DATE } from '$lib/utils/constants.ts';
import { EpisodeSiloMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloMappedMock.ts';
import { EpisodeSiloPeopleMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloPeopleMappedMock.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { MovieHereticPeopleMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticPeopleMappedMock.ts';
import { MovieHereticStudiosMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticStudiosMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { ShowSiloNetworksMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloNetworksMappedMock.ts';
import { ShowSiloPeopleMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloPeopleMappedMock.ts';
import { ShowSiloStudiosMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloStudiosMappedMock.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { screen, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MediaDetailsProps } from '../MediaDetailsProps.ts';
import MediaDetails from './MediaDetails.svelte';

describe('MediaDetails', () => {
  const mediaTests = (props: MediaDetailsProps & { type: MediaType }) => {
    it('should display the media details sections', async () => {
      renderComponent(
        MediaDetails,
        { props },
      );

      await waitFor(() => {
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
    });

    it('should distinguish upcoming items', async () => {
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);

      renderComponent(
        MediaDetails,
        {
          props: {
            ...props,
            media: {
              ...props.media,
              airDate: nextYear,
            },
          } as MediaDetailsProps,
        },
      );

      await waitFor(() => {
        const premiereLabel = screen.getByText('Expected Premiere');
        expect(premiereLabel).toBeInTheDocument();
      });
    });

    it('should show the status if there is no known year for an item', async () => {
      renderComponent(
        MediaDetails,
        {
          props: {
            ...props,
            media: {
              ...props.media,
              year: undefined,
              airDate: MAX_DATE,
            },
          } as MediaDetailsProps,
        },
      );

      await waitFor(() => {
        const statusLabel = screen.getByText('Status');
        const premieredLabel = screen.queryByText('Premiered');

        expect(statusLabel).toBeInTheDocument();
        expect(premieredLabel).not.toBeInTheDocument();
      });
    });

    it('should hide undefined values', async () => {
      renderComponent(
        MediaDetails,
        {
          props: {
            ...props,
            media: {
              ...props.media,
              country: undefined,
            },
          } as MediaDetailsProps,
        },
      );

      await waitFor(() => {
        const countryLabel = screen.queryByText('Country');
        expect(countryLabel).not.toBeInTheDocument();
      });
    });

    it('should not show the original title if it is equal to the title', async () => {
      renderComponent(
        MediaDetails,
        {
          props: {
            ...props,
            media: {
              ...props.media,
              originalTitle: props.media.title,
            },
          } as MediaDetailsProps,
        },
      );

      await waitFor(() => {
        const originalTitleLabel = screen.queryByText('Original Title');
        expect(originalTitleLabel).not.toBeInTheDocument();
      });
    });

    it('should show the original title if it differs from the title', async () => {
      renderComponent(
        MediaDetails,
        {
          props: {
            ...props,
            media: {
              ...props.media,
              originalTitle: 'random media title',
            },
          } as MediaDetailsProps,
        },
      );

      await waitFor(() => {
        const originalTitleLabel = screen.getByText('Original Title');
        expect(originalTitleLabel).toBeInTheDocument();
      });
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

    it('should display the director instead of creator', async () => {
      renderComponent(
        MediaDetails,
        { props: defaultProps },
      );

      await waitFor(() => {
        const directorLabel = screen.getByText('Director');
        const creatorLabel = screen.queryByText('Creator');

        expect(directorLabel).toBeInTheDocument();
        expect(creatorLabel).not.toBeInTheDocument();
      });
    });
  });

  describe('for a show', () => {
    const defaultProps: MediaDetailsProps = {
      media: ShowSiloMappedMock,
      studios: ShowSiloStudiosMappedMock,
      crew: ShowSiloPeopleMappedMock,
      networks: ShowSiloNetworksMappedMock,
      type: 'show',
    };

    mediaTests(defaultProps);

    it('should display the network', async () => {
      renderComponent(
        MediaDetails,
        { props: defaultProps },
      );

      await waitFor(() => {
        const networkLabel = screen.getByText('Network');
        const networkValue = screen.getByText('Apple TV+');

        expect(networkLabel).toBeInTheDocument();
        expect(networkValue).toBeInTheDocument();
      });
    });

    it('should display the total runtime for a show', async () => {
      renderComponent(
        MediaDetails,
        { props: defaultProps },
      );

      await waitFor(() => {
        const totalRuntimeLabel = screen.getByText('Total Runtime');
        const totalRuntimeValue = screen.getByText('15h (15 eps.)');

        expect(totalRuntimeLabel).toBeInTheDocument();
        expect(totalRuntimeValue).toBeInTheDocument();
      });
    });

    it('should hide total runtime when data is unavailable', async () => {
      renderComponent(
        MediaDetails,
        {
          props: {
            ...defaultProps,
            media: {
              ...defaultProps.media,
              totalRuntime: NaN,
            },
          } as MediaDetailsProps,
        },
      );

      await waitFor(() => {
        const totalRuntimeLabel = screen.queryByText('Total Runtime');
        expect(totalRuntimeLabel).not.toBeInTheDocument();
      });
    });

    it('should display the creator instead of director', async () => {
      renderComponent(
        MediaDetails,
        {
          props: defaultProps,
        },
      );

      await waitFor(() => {
        const directorLabel = screen.queryByText('Director');
        const creatorLabel = screen.getByText('Creator');

        expect(directorLabel).not.toBeInTheDocument();
        expect(creatorLabel).toBeInTheDocument();
      });
    });

    describe('airs', () => {
      beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2025-01-15T00:00:00Z'));
      });

      afterEach(() => {
        vi.useRealTimers();
      });

      it('should display the airs day and time for a currently airing show', async () => {
        renderComponent(
          MediaDetails,
          { props: defaultProps },
        );

        await waitFor(() => {
          const airsLabel = screen.getByText('Airs');
          const airsValue = screen.getByText('Fridays at 2:00 AM');

          expect(airsLabel).toBeInTheDocument();
          expect(airsValue).toBeInTheDocument();
        });
      });

      it('should hide airs for an ended show', async () => {
        renderComponent(
          MediaDetails,
          {
            props: {
              ...defaultProps,
              media: {
                ...defaultProps.media,
                status: 'ended',
              },
            } as MediaDetailsProps,
          },
        );

        await waitFor(() => {
          const airsLabel = screen.queryByText('Airs');
          expect(airsLabel).not.toBeInTheDocument();
        });
      });

      it('should hide airs for an upcoming show', async () => {
        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 1);

        renderComponent(
          MediaDetails,
          {
            props: {
              ...defaultProps,
              media: {
                ...defaultProps.media,
                airDate: nextYear,
              },
            } as MediaDetailsProps,
          },
        );

        await waitFor(() => {
          const airsLabel = screen.queryByText('Airs');
          expect(airsLabel).not.toBeInTheDocument();
        });
      });

      it('should hide airs when airs data is missing', async () => {
        renderComponent(
          MediaDetails,
          {
            props: {
              ...defaultProps,
              media: {
                ...defaultProps.media,
                airs: undefined,
              },
            } as MediaDetailsProps,
          },
        );

        await waitFor(() => {
          const airsLabel = screen.queryByText('Airs');
          expect(airsLabel).not.toBeInTheDocument();
        });
      });
    });
  });

  describe('for an episode', () => {
    const defaultProps: MediaDetailsProps = {
      episode: EpisodeSiloMappedMock,
      crew: EpisodeSiloPeopleMappedMock,
      networks: ShowSiloNetworksMappedMock,
      type: 'episode',
      show: ShowSiloMappedMock,
    };

    it('should display the episode details', async () => {
      renderComponent(
        MediaDetails,
        {
          props: defaultProps,
        },
      );

      await waitFor(() => {
        const directorLabel = screen.getByText('Director');
        const creatorLabel = screen.queryByText('Creator');
        const airedLabel = screen.getByText('Aired');
        const runtimeLabel = screen.getByText('Runtime');

        expect(directorLabel).toBeInTheDocument();
        expect(creatorLabel).not.toBeInTheDocument();
        expect(airedLabel).toBeInTheDocument();
        expect(runtimeLabel).toBeInTheDocument();
      });
    });

    it('should display the network from the show', async () => {
      renderComponent(
        MediaDetails,
        { props: defaultProps },
      );

      await waitFor(() => {
        const networkLabel = screen.getByText('Network');
        const networkValue = screen.getByText('Apple TV+');

        expect(networkLabel).toBeInTheDocument();
        expect(networkValue).toBeInTheDocument();
      });
    });

    it('should distinguish upcoming items', async () => {
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);

      renderComponent(
        MediaDetails,
        {
          props: {
            ...defaultProps,
            episode: {
              ...defaultProps.episode,
              airDate: nextYear,
              effectiveReleaseDate: nextYear,
            },
          } as MediaDetailsProps,
        },
      );

      await waitFor(() => {
        const airsLabel = screen.getByText('Airs');
        expect(airsLabel).toBeInTheDocument();
      });
    });
  });
});

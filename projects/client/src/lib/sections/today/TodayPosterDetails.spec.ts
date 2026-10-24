import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { MovieHereticSentimentMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticSentimentMappedMock.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { RealityCheckPublicResponseMock } from '$mocks/data/summary/reality-check/response/RealityCheckPublicResponseMock.ts';
import { MovieHereticSentimentResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticSentimentResponseMock.ts';
import { server } from '$mocks/server.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { screen, waitFor } from '@testing-library/svelte';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import TodayPosterDetails from './TodayPosterDetails.svelte';

describe('TodayPosterDetails', () => {
  it('should say whether the community sentiment is positive, mixed or negative', async () => {
    renderComponent(TodayPosterDetails, {
      props: { media: MovieHereticMappedMock },
    });

    expect(await screen.findByText('Positive')).toBeInTheDocument();
    expect(screen.getByText('Sentiment')).toBeInTheDocument();
  });

  it('should show only the pros when the sentiment is positive', async () => {
    renderComponent(TodayPosterDetails, {
      props: { media: MovieHereticMappedMock },
    });

    const pro = assertDefined(
      MovieHereticSentimentMappedMock.aspect.pros.at(0),
    );
    const con = assertDefined(
      MovieHereticSentimentMappedMock.aspect.cons.at(0),
    );

    expect(await screen.findByText(pro)).toBeInTheDocument();
    expect(screen.queryByText(con)).not.toBeInTheDocument();
  });

  it('should show people named in the highlight as plain text', async () => {
    server.use(
      http.get(
        `http://localhost/v3/media/movie/${MovieHereticMappedMock.slug}/info/0/version/2`,
        () =>
          HttpResponse.json({
            ...MovieHereticSentimentResponseMock,
            highlight:
              "[Hugh Grant](https://app.trakt.tv/people/hugh-grant)'s performance is the film's strength.",
          }),
      ),
    );

    renderComponent(TodayPosterDetails, {
      props: { media: MovieHereticMappedMock },
    });

    expect(
      await screen.findByText(
        "Hugh Grant's performance is the film's strength.",
      ),
    ).toBeInTheDocument();
  });

  describe('Reality Check', () => {
    const REALITY_CHECK_URL = `http://localhost/v3/media/movie/${MovieHereticMappedMock.slug}/info/34/version/1`;

    it('should show a chip skeleton while the Reality Check loads', async () => {
      server.use(
        http.get(REALITY_CHECK_URL, async () => {
          await new Promise(() => {});
        }),
      );

      const { container } = renderComponent(TodayPosterDetails, {
        props: { media: MovieHereticMappedMock },
      });

      expect(await screen.findByText('Reality Check')).toBeInTheDocument();
      expect(
        container.querySelector('.details-reality-check .trakt-skeleton'),
      ).toBeInTheDocument();
    });

    it('should show the meter and the verdict once it loads', async () => {
      server.use(
        http.get(REALITY_CHECK_URL, () =>
          HttpResponse.json(RealityCheckPublicResponseMock),
        ),
      );

      const { container } = renderComponent(TodayPosterDetails, {
        props: { media: MovieHereticMappedMock },
      });

      expect(await screen.findByText('Loosely based')).toBeInTheDocument();
      expect(
        container.querySelectorAll(
          '.details-reality-check .meter-segment.is-filled',
        ),
      ).toHaveLength(2);
      expect(
        container.querySelector('.details-reality-check .trakt-skeleton'),
      ).toBeNull();
    });

    it('should leave out the row when the title has no Reality Check', async () => {
      renderComponent(TodayPosterDetails, {
        props: { media: MovieHereticMappedMock },
      });

      await screen.findByText('Positive');

      await waitFor(() =>
        expect(screen.queryByText('Reality Check')).not.toBeInTheDocument(),
      );
    });
  });
});

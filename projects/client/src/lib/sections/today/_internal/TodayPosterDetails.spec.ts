import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { MovieHereticSentimentMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticSentimentMappedMock.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { screen } from '@testing-library/svelte';
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
});

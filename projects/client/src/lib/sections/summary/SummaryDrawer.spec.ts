import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { MovieHereticPeopleMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticPeopleMappedMock.ts';
import { MovieHereticStudiosMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticStudiosMappedMock.ts';
import { MovieHereticSentimentMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticSentimentMappedMock.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { screen } from '@testing-library/svelte';
import type { ComponentProps } from 'svelte';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import SummaryDrawer from './SummaryDrawer.svelte';

type InsightProps = Pick<
  ComponentProps<typeof SummaryDrawer>,
  'sentiment' | 'realityCheck'
>;

function renderDrawer(props: InsightProps) {
  return renderComponent(SummaryDrawer, {
    props: {
      ...props,
      type: 'movie',
      media: MovieHereticMappedMock,
      studios: MovieHereticStudiosMappedMock,
      crew: MovieHereticPeopleMappedMock,
    },
  });
}

describe('SummaryDrawer', () => {
  beforeEach(() => {
    setAuthorization(true);
    window.history.replaceState({}, '', '/movies/heretic-2024?view=sentiment');
  });

  afterEach(() => {
    window.history.replaceState({}, '', '/');
  });

  it('should open the insights drawer with a skeleton while data loads', async () => {
    const { baseElement } = renderDrawer({
      sentiment: undefined,
      realityCheck: undefined,
    });

    expect(
      await screen.findByRole('tab', { name: 'Reality Check' }),
    ).toBeInTheDocument();
    expect(
      baseElement.querySelector('.trakt-reality-check-skeleton'),
    ).toBeInTheDocument();
  });

  it('should open the drawer while one source loads and the other has data', async () => {
    renderDrawer({
      sentiment: MovieHereticSentimentMappedMock,
      realityCheck: undefined,
    });

    expect(
      await screen.findByRole('tab', { name: 'Sentiment' }),
    ).toBeInTheDocument();
  });

  it('should not open the drawer once both resolved without data', () => {
    renderDrawer({ sentiment: null, realityCheck: null });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
  });
});

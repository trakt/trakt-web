import { MovieHereticSentimentMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticSentimentMappedMock.ts';
import { RealityCheckPublicMappedMock } from '$mocks/data/summary/reality-check/mapped/RealityCheckPublicMappedMock.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { screen, waitFor } from '@testing-library/svelte';
import type { ComponentProps } from 'svelte';
import { describe, expect, it } from 'vitest';
import Sentiment from './Sentiment.svelte';

const SKELETON = '.trakt-skeleton';

function renderSection(
  props: Pick<ComponentProps<typeof Sentiment>, 'sentiment' | 'realityCheck'>,
) {
  return renderComponent(Sentiment, {
    props: { ...props, slug: 'heretic-2024', type: 'movie' },
  });
}

describe('Sentiment', () => {
  it('should show the section with a skeleton card while both load', async () => {
    const { container } = renderSection({
      sentiment: undefined,
      realityCheck: undefined,
    });

    expect(await screen.findByText('Insights')).toBeInTheDocument();
    await waitFor(() =>
      expect(container.querySelector(SKELETON)).toBeInTheDocument(),
    );
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('should keep the skeleton card while only the Reality Check loads', async () => {
    const { container } = renderSection({
      sentiment: MovieHereticSentimentMappedMock,
      realityCheck: undefined,
    });

    expect(await screen.findByText('Insights')).toBeInTheDocument();
    await waitFor(() =>
      expect(container.querySelector(SKELETON)).toBeInTheDocument(),
    );
  });

  it('should keep the skeleton card while only the sentiment loads', async () => {
    const { container } = renderSection({
      sentiment: undefined,
      realityCheck: null,
    });

    expect(await screen.findByText('Insights')).toBeInTheDocument();
    await waitFor(() =>
      expect(container.querySelector(SKELETON)).toBeInTheDocument(),
    );
  });

  it('should hide the section once both resolved without data', () => {
    const { container } = renderSection({
      sentiment: null,
      realityCheck: null,
    });

    expect(screen.queryByText('Insights')).not.toBeInTheDocument();
    expect(container.querySelector(SKELETON)).toBeNull();
  });

  it('should show the card once loaded', async () => {
    const { container } = renderSection({
      sentiment: MovieHereticSentimentMappedMock,
      realityCheck: RealityCheckPublicMappedMock,
    });

    expect(await screen.findByRole('link')).toBeInTheDocument();
    expect(container.querySelector(SKELETON)).toBeNull();
  });

  it('should show the card with only a Reality Check', async () => {
    renderSection({
      sentiment: null,
      realityCheck: RealityCheckPublicMappedMock,
    });

    expect(
      await screen.findByRole('link', { name: 'View Reality Check' }),
    ).toBeInTheDocument();
  });
});

import { MovieHereticSentimentMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticSentimentMappedMock.ts';
import { RealityCheckPublicMappedMock } from '$mocks/data/summary/reality-check/mapped/RealityCheckPublicMappedMock.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import SentimentCard from './SentimentCard.svelte';

const { track } = vi.hoisted(() => ({ track: vi.fn() }));

vi.mock('$lib/features/analytics/useTrack.ts', () => ({
  useTrack: () => ({ track }),
}));

const PILL = '.trakt-reality-tier-pill';
const SKELETON = '.trakt-skeleton';

async function renderCard(props: ComponentProps<typeof SentimentCard>) {
  const view = renderComponent(SentimentCard, { props });
  await screen.findByRole('link');
  return view;
}

describe('SentimentCard', () => {
  afterEach(() => {
    track.mockClear();
  });

  it('should show the Reality Check pill in the footer next to the arrow', async () => {
    const { container } = await renderCard({
      sentiment: MovieHereticSentimentMappedMock,
      realityCheck: RealityCheckPublicMappedMock,
    });

    const footer = container.querySelector('.trakt-sentiment-footer');
    expect(footer?.querySelector(PILL)).toHaveTextContent('Loosely based');
    expect(footer?.querySelectorAll('.meter-segment.is-filled')).toHaveLength(
      2,
    );
    expect(footer?.querySelector('.trakt-sentiment-arrow')).toBeInTheDocument();
    expect(screen.getByText('Positive')).toBeInTheDocument();
  });

  it('should render a skeleton card without a link while the Reality Check loads', async () => {
    const { container } = renderComponent(SentimentCard, {
      props: {
        sentiment: MovieHereticSentimentMappedMock,
        realityCheck: undefined,
      },
    });

    await waitFor(() =>
      expect(container.querySelector(SKELETON)).toBeInTheDocument(),
    );
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(container.querySelector(PILL)).toBeNull();
    expect(screen.queryByText('Positive')).not.toBeInTheDocument();
  });

  it('should render a skeleton card without a link while the sentiment loads', async () => {
    const { container } = renderComponent(SentimentCard, {
      props: { sentiment: undefined, realityCheck: null },
    });

    await waitFor(() =>
      expect(container.querySelector(SKELETON)).toBeInTheDocument(),
    );
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('should keep the card size across loading and loaded states', async () => {
    const sizeOf = (container: HTMLElement) =>
      container.querySelector('svelte-css-wrapper')?.getAttribute('style');

    const loading = renderComponent(SentimentCard, {
      props: { sentiment: undefined, realityCheck: undefined },
    });
    await waitFor(() =>
      expect(loading.container.querySelector(SKELETON)).toBeInTheDocument(),
    );
    const loadingSize = sizeOf(loading.container);
    loading.unmount();

    const loaded = await renderCard({
      sentiment: MovieHereticSentimentMappedMock,
      realityCheck: RealityCheckPublicMappedMock,
    });

    expect(loadingSize).toContain('--height-card');
    expect(sizeOf(loaded.container)).toBe(loadingSize);
  });

  it('should look like today without a Reality Check', async () => {
    const { container } = await renderCard({
      sentiment: MovieHereticSentimentMappedMock,
      realityCheck: null,
    });

    const footer = container.querySelector('.trakt-sentiment-footer');
    expect(footer?.querySelector(PILL)).toBeNull();
    expect(footer?.querySelector(SKELETON)).toBeNull();
    expect(footer?.children).toHaveLength(1);
  });

  it('should show the verdict summary instead of the pros without sentiment', async () => {
    const { container } = await renderCard({
      sentiment: null,
      realityCheck: RealityCheckPublicMappedMock,
    });

    expect(screen.getByText('Reality Check')).toBeInTheDocument();
    expect(
      screen.getByText(RealityCheckPublicMappedMock.summary),
    ).toBeInTheDocument();
    expect(container.querySelector(PILL)).toHaveTextContent('Loosely based');
    expect(container.querySelector('ul')).toBeNull();
  });

  it('should label the link for the Reality Check without sentiment', async () => {
    await renderCard({
      sentiment: null,
      realityCheck: RealityCheckPublicMappedMock,
    });

    expect(
      screen.getByRole('link', { name: 'View Reality Check' }),
    ).toBeInTheDocument();
  });

  it('should track the open as sentiment when the card leads with sentiment', async () => {
    const user = userEvent.setup();
    await renderCard({
      sentiment: MovieHereticSentimentMappedMock,
      realityCheck: RealityCheckPublicMappedMock,
    });

    await user.click(screen.getByRole('link'));

    expect(track).toHaveBeenCalledWith({ source: 'sentiment' });
  });

  it('should track the open as reality-check when the card leads with the Reality Check', async () => {
    const user = userEvent.setup();
    await renderCard({
      sentiment: null,
      realityCheck: RealityCheckPublicMappedMock,
    });

    await user.click(screen.getByRole('link'));

    expect(track).toHaveBeenCalledWith({ source: 'reality-check' });
  });
});

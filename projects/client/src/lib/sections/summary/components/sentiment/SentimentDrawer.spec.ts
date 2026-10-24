import { RealityCheckPublicMappedMock } from '$mocks/data/summary/reality-check/mapped/RealityCheckPublicMappedMock.ts';
import { goto } from '$app/navigation';
import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { MovieHereticSentimentMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticSentimentMappedMock.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import SentimentDrawer from './SentimentDrawer.svelte';

const { track } = vi.hoisted(() => ({ track: vi.fn() }));

vi.mock('$lib/features/analytics/useTrack.ts', () => ({
  useTrack: (event: string) => ({
    track: (data: unknown) => track(event, data),
  }),
}));

const onClose = vi.fn();

describe('SentimentDrawer', () => {
  beforeEach(() => {
    setAuthorization(true);
    vi.mocked(goto).mockClear();
    track.mockClear();
  });

  afterEach(() => {
    window.history.replaceState({}, '', '/');
  });

  it('should open on the Reality Check tab and switch to sentiment', async () => {
    const user = userEvent.setup();

    renderComponent(SentimentDrawer, {
      props: {
        sentiment: MovieHereticSentimentMappedMock,
        realityCheck: RealityCheckPublicMappedMock,
        source: 'card',
        onClose,
      },
    });

    const realityTab = await screen.findByRole('tab', {
      name: 'Reality Check',
    });
    expect(realityTab).toHaveAttribute('data-state', 'active');
    expect(
      await screen.findByRole('heading', { name: 'Loosely based' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Sentiment' }));

    expect(
      await screen.findByText(MovieHereticSentimentMappedMock.highlight),
    ).toBeInTheDocument();
  });

  it('should show the skeleton in the Reality Check tab while it loads', async () => {
    const { baseElement } = renderComponent(SentimentDrawer, {
      props: {
        sentiment: MovieHereticSentimentMappedMock,
        realityCheck: undefined,
        source: 'card',
        onClose,
      },
    });

    await screen.findByRole('tab', { name: 'Reality Check' });

    expect(
      baseElement.querySelector('.trakt-reality-check-skeleton'),
    ).toBeInTheDocument();
  });

  it('should show no tabs without a Reality Check', async () => {
    renderComponent(SentimentDrawer, {
      props: {
        sentiment: MovieHereticSentimentMappedMock,
        realityCheck: null,
        source: 'card',
        onClose,
      },
    });

    expect(
      await screen.findByText(MovieHereticSentimentMappedMock.highlight),
    ).toBeInTheDocument();
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
  });

  it('should show only the Reality Check without sentiment', async () => {
    renderComponent(SentimentDrawer, {
      props: {
        sentiment: null,
        realityCheck: RealityCheckPublicMappedMock,
        source: 'card',
        onClose,
      },
    });

    expect(
      await screen.findByRole('heading', { name: 'Loosely based' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
  });

  it('should open with tabs and skeleton bodies while both load', async () => {
    const user = userEvent.setup();

    const { baseElement } = renderComponent(SentimentDrawer, {
      props: {
        sentiment: undefined,
        realityCheck: undefined,
        source: 'card',
        onClose,
      },
    });

    expect(await screen.findByRole('tab', { name: 'Sentiment' })).toBeVisible();
    expect(screen.getByRole('tab', { name: 'Reality Check' })).toBeVisible();
    expect(
      baseElement.querySelector('.trakt-reality-check-skeleton'),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Sentiment' }));

    expect(
      baseElement.querySelector('.trakt-sentiment-content-skeleton'),
    ).toBeInTheDocument();
  });

  it('should show the sentiment skeleton without tabs while only it loads', async () => {
    const { baseElement } = renderComponent(SentimentDrawer, {
      props: {
        sentiment: undefined,
        realityCheck: null,
        source: 'card',
        onClose,
      },
    });

    await waitFor(() =>
      expect(
        baseElement.querySelector('.trakt-sentiment-content-skeleton'),
      ).toBeInTheDocument(),
    );
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
  });

  it('should show the Reality Check skeleton without tabs while only it loads', async () => {
    const { baseElement } = renderComponent(SentimentDrawer, {
      props: {
        sentiment: null,
        realityCheck: undefined,
        source: 'card',
        onClose,
      },
    });

    await waitFor(() =>
      expect(
        baseElement.querySelector('.trakt-reality-check-skeleton'),
      ).toBeInTheDocument(),
    );
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
  });

  it('should open on the tab named in the url', async () => {
    window.history.replaceState(
      {},
      '',
      '/movies/heretic-2024?view=sentiment&tab=sentiment',
    );

    renderComponent(SentimentDrawer, {
      props: {
        sentiment: MovieHereticSentimentMappedMock,
        realityCheck: RealityCheckPublicMappedMock,
        source: 'card',
        onClose,
      },
    });

    expect(
      await screen.findByRole('tab', { name: 'Sentiment' }),
    ).toHaveAttribute('data-state', 'active');
  });

  it('should fall back to Reality Check for an unknown tab in the url', async () => {
    window.history.replaceState(
      {},
      '',
      '/movies/heretic-2024?view=sentiment&tab=nope',
    );

    renderComponent(SentimentDrawer, {
      props: {
        sentiment: MovieHereticSentimentMappedMock,
        realityCheck: RealityCheckPublicMappedMock,
        source: 'card',
        onClose,
      },
    });

    expect(
      await screen.findByRole('tab', { name: 'Reality Check' }),
    ).toHaveAttribute('data-state', 'active');
  });

  it('should write the selected tab to the url without a history entry', async () => {
    const user = userEvent.setup();
    window.history.replaceState({}, '', '/movies/heretic-2024?view=sentiment');

    renderComponent(SentimentDrawer, {
      props: {
        sentiment: MovieHereticSentimentMappedMock,
        realityCheck: RealityCheckPublicMappedMock,
        source: 'card',
        onClose,
      },
    });

    await user.click(await screen.findByRole('tab', { name: 'Sentiment' }));

    const [target, options] = vi.mocked(goto).mock.calls.at(0) ?? [];
    const url = new URL(String(target));
    expect(url.searchParams.get('tab')).toBe('sentiment');
    expect(url.searchParams.get('view')).toBe('sentiment');
    expect(options).toMatchObject({ replaceState: true });
  });

  it('should track the open once with the initial tab and source', async () => {
    renderComponent(SentimentDrawer, {
      props: {
        sentiment: MovieHereticSentimentMappedMock,
        realityCheck: RealityCheckPublicMappedMock,
        source: 'card',
        onClose,
      },
    });

    await screen.findByRole('tab', { name: 'Reality Check' });

    expect(track).toHaveBeenCalledTimes(1);
    expect(track).toHaveBeenCalledWith(AnalyticsEvent.InsightsOpen, {
      source: 'card',
      tab: 'reality-check',
    });
  });

  it('should track the open from a direct link on the tab named in the url', async () => {
    window.history.replaceState(
      {},
      '',
      '/movies/heretic-2024?view=sentiment&tab=sentiment',
    );

    renderComponent(SentimentDrawer, {
      props: {
        sentiment: MovieHereticSentimentMappedMock,
        realityCheck: RealityCheckPublicMappedMock,
        source: 'link',
        onClose,
      },
    });

    await screen.findByRole('tab', { name: 'Sentiment' });

    expect(track).toHaveBeenCalledTimes(1);
    expect(track).toHaveBeenCalledWith(AnalyticsEvent.InsightsOpen, {
      source: 'link',
      tab: 'sentiment',
    });
  });

  it('should track the open on the tab that is shown without tabs', async () => {
    window.history.replaceState({}, '', '/movies/heretic-2024?view=sentiment');

    renderComponent(SentimentDrawer, {
      props: {
        sentiment: MovieHereticSentimentMappedMock,
        realityCheck: null,
        source: 'card',
        onClose,
      },
    });

    await screen.findByText(MovieHereticSentimentMappedMock.highlight);

    expect(track).toHaveBeenCalledTimes(1);
    expect(track).toHaveBeenCalledWith(AnalyticsEvent.InsightsOpen, {
      source: 'card',
      tab: 'sentiment',
    });
  });

  it('should track a tab switch with the tab and no drilldown', async () => {
    const user = userEvent.setup();

    renderComponent(SentimentDrawer, {
      props: {
        sentiment: MovieHereticSentimentMappedMock,
        realityCheck: RealityCheckPublicMappedMock,
        source: 'card',
        onClose,
      },
    });

    await screen.findByRole('tab', { name: 'Reality Check' });
    track.mockClear();

    await user.click(screen.getByRole('tab', { name: 'Sentiment' }));
    expect(track).toHaveBeenLastCalledWith(AnalyticsEvent.InsightsTab, {
      tab: 'sentiment',
    });

    await user.click(screen.getByRole('tab', { name: 'Reality Check' }));
    expect(track).toHaveBeenLastCalledWith(AnalyticsEvent.InsightsTab, {
      tab: 'reality-check',
    });
    expect(track).toHaveBeenCalledTimes(2);
    expect(track).not.toHaveBeenCalledWith(
      AnalyticsEvent.Drilldown,
      expect.anything(),
    );
  });
});

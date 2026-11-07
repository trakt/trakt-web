import { RealityCheckPublicMappedMock } from '$mocks/data/summary/reality-check/mapped/RealityCheckPublicMappedMock.ts';
import { goto } from '$app/navigation';
import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import type { MatchResponse } from '$lib/requests/models/MatchResponse.ts';
import { MatchResponseMock } from '$mocks/data/summary/match/response/MatchResponseMock.ts';
import { RecommendedMoviesResponseMock } from '$mocks/data/recommendations/response/RecommendedMoviesResponseMock.ts';
import { ExtendedUsersResponseMock } from '$mocks/data/users/response/ExtendedUserSettingsResponseMock.ts';
import { server } from '$mocks/server.ts';
import { MovieHereticSentimentMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticSentimentMappedMock.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import SentimentDrawer from './SentimentDrawer.svelte';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';

const { track } = vi.hoisted(() => ({ track: vi.fn() }));

vi.mock('$lib/features/analytics/useTrack.ts', () => ({
  useTrack: (event: string) => ({
    track: (data: unknown) => track(event, data),
  }),
}));

const onClose = vi.fn();

const TARGET = { media: { ...MovieHereticMappedMock, id: 1 } };

function serveMatch(
  match: number | null,
  taste: MatchResponse['taste'] = MatchResponseMock.taste,
  kind: 'match' | 'hype' = 'match',
) {
  server.use(
    http.get('http://localhost/movies/:id/match', () =>
      HttpResponse.json({ kind, match, taste }),
    ),
  );
}

function serveDirector() {
  server.use(
    http.get('http://localhost/users/settings', () =>
      HttpResponse.json({
        ...ExtendedUsersResponseMock,
        user: { ...ExtendedUsersResponseMock.user, director: true },
      }),
    ),
  );
}

function serveReasons() {
  const requested = vi.fn();
  server.use(
    http.get('http://localhost/v3/recommendations/movie/:id/reasons', () => {
      requested();
      return HttpResponse.json({
        sources: [
          {
            id: 1,
            type: 'favorite',
            stars: null,
            movie: RecommendedMoviesResponseMock[0]!.movie,
          },
        ],
        people: [],
      });
    }),
  );
  return requested;
}

function serveFreeUser() {
  server.use(
    http.get('http://localhost/users/settings', () =>
      HttpResponse.json({
        ...ExtendedUsersResponseMock,
        user: { ...ExtendedUsersResponseMock.user, vip: false, vip_ep: false },
      }),
    ),
  );
}

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
        ...TARGET,
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
        ...TARGET,
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
        ...TARGET,
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
        ...TARGET,
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
        ...TARGET,
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
        ...TARGET,
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
        ...TARGET,
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
        ...TARGET,
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
        ...TARGET,
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
        ...TARGET,
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
        ...TARGET,
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
        ...TARGET,
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
        ...TARGET,
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
        ...TARGET,
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

  it('should add a Match tab after the others when there is a score', async () => {
    serveMatch(91);
    serveReasons();

    renderComponent(SentimentDrawer, {
      props: {
        sentiment: MovieHereticSentimentMappedMock,
        realityCheck: RealityCheckPublicMappedMock,
        ...TARGET,
        source: 'card',
        onClose,
      },
    });

    await waitFor(() =>
      expect(
        screen.getAllByRole('tab').map((tab) => tab.textContent?.trim()),
      ).toEqual(['Sentiment', 'Reality Check', 'Match']),
    );
  });

  it('should show tabs for sentiment and match without a Reality Check', async () => {
    serveMatch(85);
    serveReasons();

    renderComponent(SentimentDrawer, {
      props: {
        sentiment: MovieHereticSentimentMappedMock,
        realityCheck: null,
        ...TARGET,
        source: 'card',
        onClose,
      },
    });

    expect(await screen.findByRole('tab', { name: 'Match' })).toBeVisible();
    expect(screen.getByRole('tab', { name: 'Sentiment' })).toBeVisible();
  });

  it('should show no Match tab without a score', async () => {
    serveMatch(null);

    renderComponent(SentimentDrawer, {
      props: {
        sentiment: MovieHereticSentimentMappedMock,
        realityCheck: RealityCheckPublicMappedMock,
        ...TARGET,
        source: 'card',
        onClose,
      },
    });

    await screen.findByRole('tab', { name: 'Sentiment' });
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(
      screen.queryByRole('tab', { name: 'Match' }),
    ).not.toBeInTheDocument();
  });

  it('should explain the score and list the reasons for VIP', async () => {
    const user = userEvent.setup();
    serveMatch(91);
    const requested = serveReasons();

    renderComponent(SentimentDrawer, {
      props: {
        sentiment: MovieHereticSentimentMappedMock,
        realityCheck: RealityCheckPublicMappedMock,
        ...TARGET,
        source: 'card',
        onClose,
      },
    });

    await user.click(await screen.findByRole('tab', { name: 'Match' }));

    expect(
      await screen.findByText('Better match for you than 91% of titles'),
    ).toBeVisible();
    expect(
      screen.getByText('From what you watched, rated and favorited.'),
    ).toBeVisible();
    expect(await screen.findByText('Why it fits you')).toBeVisible();
    expect(requested).toHaveBeenCalled();
  });

  it('should show the tier ladder instead of a percentage for directors', async () => {
    const user = userEvent.setup();
    serveDirector();
    serveMatch(91);
    serveReasons();

    renderComponent(SentimentDrawer, {
      props: {
        sentiment: MovieHereticSentimentMappedMock,
        realityCheck: RealityCheckPublicMappedMock,
        ...TARGET,
        source: 'card',
        onClose,
      },
    });

    await user.click(await screen.findByRole('tab', { name: 'Match' }));

    const current = await waitFor(() => {
      const step = document.querySelector(
        '.trakt-match-tier-ladder [aria-current="true"]',
      );
      expect(step).not.toBeNull();
      return step;
    });
    expect(current).toHaveTextContent('Top pick');
    expect(
      screen.queryByText('Better match for you than 91% of titles'),
    ).toBeNull();
    expect(await screen.findByText('Why it fits')).toBeVisible();
  });

  it('should show hype tiers without reasons for an unreleased movie', async () => {
    serveDirector();
    serveMatch(75, [], 'hype');
    const requested = serveReasons();

    renderComponent(SentimentDrawer, {
      props: {
        sentiment: null,
        realityCheck: null,
        ...TARGET,
        source: 'card',
        onClose,
      },
    });

    expect(await screen.findAllByText('Looking good')).not.toHaveLength(0);
    expect(screen.getByText('Unreleased')).toBeVisible();
    expect(screen.queryByText('Why it fits you')).toBeNull();
    expect(requested).not.toHaveBeenCalled();
  });

  it('should show the shared subgenres as chips above the reasons', async () => {
    const user = userEvent.setup();
    serveMatch(91);
    serveReasons();

    renderComponent(SentimentDrawer, {
      props: {
        sentiment: MovieHereticSentimentMappedMock,
        realityCheck: RealityCheckPublicMappedMock,
        ...TARGET,
        source: 'card',
        onClose,
      },
    });

    await user.click(await screen.findByRole('tab', { name: 'Match' }));

    expect(await screen.findByText('Your taste')).toBeVisible();
    expect(
      screen.getAllByRole('listitem').map((item) => item.textContent),
    ).toEqual(
      expect.arrayContaining(['World War II', 'Biopic', 'Top Secret Project']),
    );
  });

  it('should show the chips to free users above the upsell', async () => {
    const user = userEvent.setup();
    serveFreeUser();
    serveMatch(91);

    renderComponent(SentimentDrawer, {
      props: {
        sentiment: MovieHereticSentimentMappedMock,
        realityCheck: RealityCheckPublicMappedMock,
        ...TARGET,
        source: 'card',
        onClose,
      },
    });

    await user.click(await screen.findByRole('tab', { name: 'Match' }));

    expect(await screen.findByText('World War II')).toBeVisible();
    expect(
      screen.getByText('Upgrade to VIP to unlock more insights.'),
    ).toBeVisible();
  });

  it('should render no taste row without shared subgenres', async () => {
    const user = userEvent.setup();
    serveMatch(91, []);
    serveReasons();

    renderComponent(SentimentDrawer, {
      props: {
        sentiment: MovieHereticSentimentMappedMock,
        realityCheck: RealityCheckPublicMappedMock,
        ...TARGET,
        source: 'card',
        onClose,
      },
    });

    await user.click(await screen.findByRole('tab', { name: 'Match' }));

    expect(await screen.findByText('Why it fits you')).toBeVisible();
    expect(screen.queryByText('Your taste')).not.toBeInTheDocument();
  });

  it('should hide the reasons below the low score threshold', async () => {
    const user = userEvent.setup();
    serveMatch(12);
    const requested = serveReasons();

    renderComponent(SentimentDrawer, {
      props: {
        sentiment: MovieHereticSentimentMappedMock,
        realityCheck: RealityCheckPublicMappedMock,
        ...TARGET,
        source: 'card',
        onClose,
      },
    });

    await user.click(await screen.findByRole('tab', { name: 'Match' }));

    expect(
      await screen.findByText('Better match for you than 12% of titles'),
    ).toBeVisible();
    expect(screen.queryByText('Why it fits you')).not.toBeInTheDocument();
    expect(requested).not.toHaveBeenCalled();
  });

  it('should show the score and the upsell instead of the reasons for free users', async () => {
    const user = userEvent.setup();
    serveFreeUser();
    serveMatch(91);
    const requested = serveReasons();

    renderComponent(SentimentDrawer, {
      props: {
        sentiment: MovieHereticSentimentMappedMock,
        realityCheck: RealityCheckPublicMappedMock,
        ...TARGET,
        source: 'card',
        onClose,
      },
    });

    await user.click(await screen.findByRole('tab', { name: 'Match' }));

    expect(
      await screen.findByText('Better match for you than 91% of titles'),
    ).toBeVisible();
    expect(
      await screen.findByText(
        'Your score is free. The reasons behind it are a VIP feature.',
      ),
    ).toBeVisible();
    expect(
      screen.getByText('Upgrade to VIP to unlock more insights.'),
    ).toBeVisible();
    expect(screen.queryByText('Why it fits you')).not.toBeInTheDocument();
    expect(requested).not.toHaveBeenCalled();
  });

  it('should open on the Match tab named in the url', async () => {
    serveMatch(91);
    serveReasons();
    window.history.replaceState(
      {},
      '',
      '/movies/heretic-2024?view=sentiment&tab=match',
    );

    renderComponent(SentimentDrawer, {
      props: {
        sentiment: MovieHereticSentimentMappedMock,
        realityCheck: RealityCheckPublicMappedMock,
        ...TARGET,
        source: 'link',
        onClose,
      },
    });

    await waitFor(() =>
      expect(screen.getByRole('tab', { name: 'Match' })).toHaveAttribute(
        'data-state',
        'active',
      ),
    );
  });

  it('should track the open on the Match tab named in the url', async () => {
    serveMatch(91);
    serveReasons();
    window.history.replaceState(
      {},
      '',
      '/movies/heretic-2024?view=sentiment&tab=match',
    );

    renderComponent(SentimentDrawer, {
      props: {
        sentiment: MovieHereticSentimentMappedMock,
        realityCheck: RealityCheckPublicMappedMock,
        ...TARGET,
        source: 'link',
        onClose,
      },
    });

    await waitFor(() =>
      expect(track).toHaveBeenCalledWith(AnalyticsEvent.InsightsOpen, {
        source: 'link',
        tab: 'match',
      }),
    );
    expect(
      track.mock.calls.filter(
        ([event]) => event === AnalyticsEvent.InsightsOpen,
      ),
    ).toHaveLength(1);
  });

  it('should track a switch to the Match tab', async () => {
    const user = userEvent.setup();
    serveMatch(91);
    serveReasons();

    renderComponent(SentimentDrawer, {
      props: {
        sentiment: MovieHereticSentimentMappedMock,
        realityCheck: RealityCheckPublicMappedMock,
        ...TARGET,
        source: 'card',
        onClose,
      },
    });

    await user.click(await screen.findByRole('tab', { name: 'Match' }));

    expect(track).toHaveBeenLastCalledWith(AnalyticsEvent.InsightsTab, {
      tab: 'match',
    });
  });
});

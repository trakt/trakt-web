import { MatchResponseMock } from '$mocks/data/summary/match/response/MatchResponseMock.ts';
import { ExtendedUsersResponseMock } from '$mocks/data/users/response/ExtendedUserSettingsResponseMock.ts';
import { MovieHereticSentimentMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticSentimentMappedMock.ts';
import { RealityCheckPublicMappedMock } from '$mocks/data/summary/reality-check/mapped/RealityCheckPublicMappedMock.ts';
import { server } from '$mocks/server.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { delay, http, HttpResponse } from 'msw';
import type { ComponentProps } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import InsightsCard from './InsightsCard.svelte';

const { track } = vi.hoisted(() => ({ track: vi.fn() }));

vi.mock('$lib/features/analytics/useTrack.ts', () => ({
  useTrack: () => ({ track }),
}));

const PILL = '.trakt-reality-tier-pill';
const SKELETON = '.trakt-skeleton';

const TARGET = { type: 'movie', id: 1 } as const;

type CardProps = Omit<ComponentProps<typeof InsightsCard>, 'type' | 'id'>;

async function renderCard(props: CardProps) {
  const view = renderComponent(InsightsCard, {
    props: { ...TARGET, ...props },
  });
  await screen.findByRole('link');
  return view;
}

function serveMatch(
  match: number | null,
  status = 200,
  kind: 'match' | 'hype' = 'match',
) {
  server.use(
    http.get('http://localhost/movies/:id/match', () =>
      status === 200
        ? HttpResponse.json({ ...MatchResponseMock, kind, match })
        : new HttpResponse(null, { status }),
    ),
  );
}

const ORBIT = '.trakt-match-orbit';
const SLOT = '.trakt-match-ring-slot';

describe('InsightsCard', () => {
  beforeEach(() => {
    setAuthorization(true);
  });

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
    const { container } = renderComponent(InsightsCard, {
      props: {
        ...TARGET,
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
    const { container } = renderComponent(InsightsCard, {
      props: { ...TARGET, sentiment: undefined, realityCheck: null },
    });

    await waitFor(() =>
      expect(container.querySelector(SKELETON)).toBeInTheDocument(),
    );
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('should keep the card size across loading and loaded states', async () => {
    const sizeOf = (container: HTMLElement) =>
      container.querySelector('svelte-css-wrapper')?.getAttribute('style');

    const loading = renderComponent(InsightsCard, {
      props: { ...TARGET, sentiment: undefined, realityCheck: undefined },
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

  it('should show the match orbit lit to the score level around the viewer avatar', async () => {
    serveMatch(91);
    const { container } = await renderCard({
      sentiment: MovieHereticSentimentMappedMock,
      realityCheck: RealityCheckPublicMappedMock,
    });

    await waitFor(() =>
      expect(container.querySelector(ORBIT)).toHaveAttribute('data-level', '4'),
    );
    expect(
      screen.getByRole('img', { name: '91% match for you' }),
    ).toBeVisible();
    expect(container.querySelector(ORBIT)).not.toHaveTextContent('91');
    expect(container.querySelector(ORBIT)).toHaveStyle({
      '--match-orbit-sweep': '1',
    });
    expect(
      container.querySelector(`${ORBIT} .trakt-match-orbit-head`),
    ).toBeInTheDocument();
    expect(
      container.querySelector(`${ORBIT} .trakt-match-avatar`),
    ).toBeInTheDocument();
    expect(container.querySelector(PILL)).toHaveTextContent('Loosely based');
  });

  it('should hold the ring slot while the score loads', async () => {
    server.use(
      http.get('http://localhost/movies/:id/match', async () => {
        await delay('infinite');
        return HttpResponse.json(MatchResponseMock);
      }),
    );
    const { container } = await renderCard({
      sentiment: MovieHereticSentimentMappedMock,
      realityCheck: null,
    });

    await waitFor(() =>
      expect(
        container.querySelector('.trakt-match-ring-skeleton'),
      ).toBeInTheDocument(),
    );
    expect(container.querySelector('.has-ring')).toBeInTheDocument();
  });

  it('should show an empty ring when there is no score yet', async () => {
    serveMatch(null);
    const { container } = await renderCard({
      sentiment: MovieHereticSentimentMappedMock,
      realityCheck: null,
    });

    expect(
      await screen.findByRole('img', { name: 'No match score for you yet' }),
    ).toBeVisible();
    expect(container.querySelector('.trakt-match-orbit-tail')).toBeNull();
  });

  it('should keep the orbit in the corner slot for every state, with no text', async () => {
    serveMatch(91);
    const withSentiment = await renderCard({
      sentiment: MovieHereticSentimentMappedMock,
      realityCheck: null,
    });
    await waitFor(() =>
      expect(
        withSentiment.container.querySelector(`${SLOT} ${ORBIT}`),
      ).toHaveAttribute('data-level', '4'),
    );
    expect(withSentiment.container.querySelector(SLOT)).not.toHaveTextContent(
      'Match',
    );
    withSentiment.unmount();

    const matchOnly = await renderCard({ sentiment: null, realityCheck: null });
    await waitFor(() =>
      expect(
        matchOnly.container.querySelector(`${SLOT} ${ORBIT}`),
      ).toHaveAttribute('data-level', '4'),
    );
    expect(
      matchOnly.container.querySelector('.trakt-sentiment-match'),
    ).toBeInTheDocument();
  });

  it('should keep the sentiment card size on a match-only card', async () => {
    const sizeOf = (container: HTMLElement) =>
      container.querySelector('svelte-css-wrapper')?.getAttribute('style');

    serveMatch(80);
    const withSentiment = await renderCard({
      sentiment: MovieHereticSentimentMappedMock,
      realityCheck: null,
    });
    const sentimentSize = sizeOf(withSentiment.container);
    withSentiment.unmount();

    const matchOnly = await renderCard({ sentiment: null, realityCheck: null });

    expect(sizeOf(matchOnly.container)).toBe(sentimentSize);
  });

  it('should put the match tier where the sentiment would be, with no percentage', async () => {
    serveMatch(80);
    const { container } = await renderCard({
      sentiment: null,
      realityCheck: null,
    });

    expect(await screen.findByText('Good fit')).toBeVisible();
    expect(
      screen.getByText('From what you watched, rated and favorited.'),
    ).toBeVisible();
    expect(container).not.toHaveTextContent('80%');
    expect(
      screen.getByRole('link', { name: 'View your match' }),
    ).toBeInTheDocument();
    expect(container.querySelector('.trakt-sentiment-arrow')).toBeVisible();
  });

  it('should hold the orbit slot with no caption skeleton while the match loads', async () => {
    server.use(
      http.get('http://localhost/movies/:id/match', async () => {
        await delay('infinite');
        return HttpResponse.json(MatchResponseMock);
      }),
    );
    const { container } = renderComponent(InsightsCard, {
      props: { ...TARGET, sentiment: null, realityCheck: null },
    });

    await waitFor(() =>
      expect(
        container.querySelector(`${SLOT} .trakt-match-ring-skeleton`),
      ).toBeInTheDocument(),
    );
    expect(container.querySelector(SLOT)?.querySelector(SKELETON)).toBeNull();
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('should say there is not enough data on a match-only card', async () => {
    serveMatch(null);
    renderComponent(InsightsCard, {
      props: { ...TARGET, sentiment: null, realityCheck: null },
    });

    expect(
      await screen.findByText('Not enough data to match this to you yet.'),
    ).toBeVisible();
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('should draw a short comet for a low score', async () => {
    serveMatch(12);
    const { container } = await renderCard({
      sentiment: MovieHereticSentimentMappedMock,
      realityCheck: null,
    });

    await waitFor(() =>
      expect(container.querySelector(ORBIT)).toHaveAttribute('data-level', '1'),
    );
    expect(container.querySelector(ORBIT)).toHaveStyle({
      '--match-orbit-sweep': '0.12',
    });
  });

  it('should show the orbit for a score of zero', async () => {
    serveMatch(0);
    const { container } = await renderCard({
      sentiment: MovieHereticSentimentMappedMock,
      realityCheck: null,
    });

    await waitFor(() =>
      expect(container.querySelector(ORBIT)).toHaveAttribute('data-level', '1'),
    );
    expect(screen.getByRole('img', { name: '0% match for you' })).toBeVisible();
  });

  it('should hold the ring for a director without VIP', async () => {
    server.use(
      http.get('http://localhost/users/settings', () =>
        HttpResponse.json({
          ...ExtendedUsersResponseMock,
          user: {
            ...ExtendedUsersResponseMock.user,
            vip: false,
            vip_ep: false,
            director: true,
          },
        }),
      ),
    );
    serveMatch(null);
    renderComponent(InsightsCard, {
      props: { ...TARGET, sentiment: null, realityCheck: null },
    });

    expect(
      await screen.findByText('Not enough data to match this to you yet.'),
    ).toBeVisible();
  });

  it('should look like today for a free user the match route refuses', async () => {
    server.use(
      http.get('http://localhost/users/settings', () =>
        HttpResponse.json({
          ...ExtendedUsersResponseMock,
          user: {
            ...ExtendedUsersResponseMock.user,
            vip: false,
            vip_ep: false,
          },
        }),
      ),
    );
    serveMatch(null, 403);
    const { container } = await renderCard({
      sentiment: MovieHereticSentimentMappedMock,
      realityCheck: null,
    });

    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(container.querySelector(ORBIT)).toBeNull();
  });

  it('should not ask for a match when signed out', async () => {
    setAuthorization(false);
    const requested = vi.fn();
    server.use(
      http.get('http://localhost/movies/:id/match', () => {
        requested();
        return HttpResponse.json(MatchResponseMock);
      }),
    );
    const { container } = await renderCard({
      sentiment: MovieHereticSentimentMappedMock,
      realityCheck: null,
    });

    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(requested).not.toHaveBeenCalled();
    expect(container.querySelector(ORBIT)).toBeNull();
  });

  it('should show hype as an unreleased tier with a flame', async () => {
    serveMatch(92, 200, 'hype');
    const { container } = await renderCard({
      sentiment: null,
      realityCheck: null,
    });

    expect(await screen.findByText("Can't wait")).toBeVisible();
    expect(screen.getByText('Unreleased')).toBeVisible();
    expect(container.querySelector(ORBIT)).toHaveAttribute('data-kind', 'hype');
    expect(screen.getByRole('img', { name: '92% hype for you' })).toBeVisible();
    expect(
      container.querySelector(`${ORBIT} .trakt-match-orbit-head.is-flame`),
    ).toBeInTheDocument();
  });
});

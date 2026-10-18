import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import type { TodayStoryGroup } from '$lib/sections/today/models/TodayStoryGroup.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { buildFriendAction } from '$test/beds/today/buildFriendAction.ts';
import { screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import TodayStoryViewer from './TodayStoryViewer.svelte';
import { toStoryGroups } from './toStoryGroups.ts';

const tracked = vi.hoisted(() => [] as Array<{ key: string; data: unknown }>);

vi.mock('$lib/features/analytics/useTrack.ts', () => ({
  useTrack: (key: string) => ({
    track: (data: unknown = {}) => tracked.push({ key, data }),
  }),
}));

const at = new Date('2026-09-28T10:00:00.000Z');

function story(media: typeof MovieHereticMappedMock) {
  return {
    key: `${media.type}-${media.id}`,
    media,
    actions: [buildFriendAction({ key: `${media.id}`, activityAt: at })],
    users: [UserProfileHarryMappedMock],
    averageRating: null,
    milestone: null,
    latestAt: at,
  };
}

const groups: TodayStoryGroup[] = toStoryGroups({
  forYou: [],
  titles: [story(MovieHereticMappedMock), story(ShowSiloMappedMock)],
});

function eventsOf(key: string) {
  return tracked
    .filter((event) => event.key === key)
    .map((event) => event.data);
}

async function renderViewer(onClose = vi.fn()) {
  const view = renderComponent(TodayStoryViewer, {
    props: { groups, startKey: null, source: 'navbar', onClose },
  });
  await screen.findByRole('dialog', {}, { timeout: 10_000 });
  return { onClose, ...view };
}

describe('TodayStoryViewer telemetry', () => {
  beforeEach(() => {
    setAuthorization(true);
    globalThis.localStorage.clear();
    tracked.length = 0;
  });

  it('should report one open with its source and the unseen state', async () => {
    await renderViewer();

    expect(eventsOf('today.open')).toEqual([
      { source: 'navbar', state: 'unseen' },
    ]);
  });

  it('should report the group type each time a group becomes current', async () => {
    const user = userEvent.setup();
    await renderViewer();
    const [next] = screen.getAllByRole('button', { name: 'Next story' });

    await user.click(assertDefined(next));

    expect(eventsOf('today.story')).toEqual([
      { type: 'title' },
      { type: 'title' },
    ]);
  });

  it('should report a close once with what was shown', async () => {
    const user = userEvent.setup();
    const { unmount } = await renderViewer();
    const [next] = screen.getAllByRole('button', { name: 'Next story' });
    await user.click(assertDefined(next));

    await user.click(screen.getByRole('button', { name: 'Close stories' }));
    unmount();

    const [close, ...rest] = eventsOf('today.close');
    expect(rest).toEqual([]);
    expect(close).toMatchObject({ reason: 'close', frames: 2, groups: 2 });
    expect(close).toHaveProperty('duration');
  });

  it('should report an end when the last story runs out', async () => {
    const user = userEvent.setup();
    await renderViewer();

    await user.click(
      assertDefined(screen.getAllByRole('button', { name: 'Next story' })[0]),
    );
    await user.click(
      assertDefined(screen.getAllByRole('button', { name: 'Next story' })[0]),
    );

    expect(eventsOf('today.close')).toMatchObject([{ reason: 'end' }]);
  });

  it('should report a leave when the viewer goes away without closing', async () => {
    const { unmount } = await renderViewer();

    unmount();

    expect(eventsOf('today.close')).toMatchObject([
      { reason: 'leave', frames: 1, groups: 1 },
    ]);
  });

  it('should report the watchlist action on a friend frame', async () => {
    const user = userEvent.setup();
    await renderViewer();

    await user.click(screen.getByRole('button', { name: /Watchlist/ }));

    expect(eventsOf('today.action')).toEqual([
      { action: 'watchlist', frame: 'friend' },
    ]);
  });

  it('should report the link to everything from today', async () => {
    const user = userEvent.setup();
    await renderViewer();

    await user.click(
      screen.getByRole('link', { name: 'View everything from today' }),
    );

    expect(eventsOf('today.action')).toEqual([
      { action: 'view-all', frame: 'friend' },
    ]);
  });
});

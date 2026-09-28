import type { TodayStoryGroup } from '$lib/sections/today/models/TodayStoryGroup.ts';
import type { TodayTitleStory } from '$lib/sections/today/models/TodayTitleStory.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { fireEvent, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { buildFriendAction } from '$test/beds/today/buildFriendAction.ts';
import { describe, expect, it, vi } from 'vitest';
import TodayStoryViewer from './TodayStoryViewer.svelte';
import { toStoryGroups } from './toStoryGroups.ts';

const at = new Date('2026-09-28T10:00:00.000Z');

function story(media: TodayTitleStory['media']): TodayTitleStory {
  const action = buildFriendAction({
    key: `${media.id}`,
    activityAt: at,
  });

  return {
    key: `${media.type}-${media.id}`,
    media,
    actions: [action],
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

async function renderViewer(startKey: string | null, onClose = vi.fn()) {
  renderComponent(TodayStoryViewer, {
    props: { groups, startKey, onClose },
  });
  await screen.findByRole('dialog');
  return onClose;
}

async function tap(name: 'Next story' | 'Previous story') {
  const user = userEvent.setup();
  const [zone] = screen.getAllByRole('button', { name });
  await user.click(assertDefined(zone));
}

describe('TodayStoryViewer', () => {
  it('should open on the requested story', async () => {
    await renderViewer(`show-${ShowSiloMappedMock.id}`);

    expect(screen.getByRole('dialog', { name: ShowSiloMappedMock.title }))
      .toBeInTheDocument();
  });

  it('should move to the next title after its last frame', async () => {
    await renderViewer(null);

    await tap('Next story');

    expect(screen.getByRole('dialog', { name: ShowSiloMappedMock.title }))
      .toBeInTheDocument();
  });

  it('should go back to the previous title', async () => {
    await renderViewer(`show-${ShowSiloMappedMock.id}`);

    await tap('Previous story');

    expect(screen.getByRole('dialog', { name: MovieHereticMappedMock.title }))
      .toBeInTheDocument();
  });

  it('should close after the last story', async () => {
    const onClose = await renderViewer(`show-${ShowSiloMappedMock.id}`);

    await tap('Next story');

    expect(onClose).toHaveBeenCalled();
  });

  it('should close from the close button', async () => {
    const user = userEvent.setup();
    const onClose = await renderViewer(null);

    await user.click(screen.getByRole('button', { name: 'Close stories' }));

    expect(onClose).toHaveBeenCalled();
  });

  it('should move on when the frame timer runs out', async () => {
    await renderViewer(null);

    await fireEvent.animationEnd(
      assertDefined(document.querySelector('.segment-timer')),
    );

    expect(screen.getByRole('dialog', { name: ShowSiloMappedMock.title }))
      .toBeInTheDocument();
  });

  it('should pause the timer while the story is held', async () => {
    await renderViewer(null);
    const stage = assertDefined(document.querySelector('.viewer-tap.is-next'));

    await fireEvent.pointerDown(stage);

    expect(document.querySelector('.segment-timer')).toHaveClass('is-paused');

    await fireEvent.pointerUp(stage);

    expect(document.querySelector('.segment-timer')).not.toHaveClass(
      'is-paused',
    );
  });

  it('should flip the poster on tap and pause', async () => {
    await renderViewer(null);

    await fireEvent.click(
      screen.getByRole('button', { name: 'Show details' }),
    );

    expect(screen.getByRole('button', { name: 'Hide details' }))
      .toHaveAttribute('aria-pressed', 'true');
    expect(document.querySelector('.segment-timer')).toHaveClass('is-paused');
  });

  it('should flip the poster while a mouse hovers it', async () => {
    await renderViewer(null);
    const flip = screen.getByRole('button', { name: 'Show details' });

    await fireEvent.pointerEnter(flip, { pointerType: 'mouse' });

    expect(flip).toHaveAttribute('aria-pressed', 'true');

    await fireEvent.pointerLeave(flip, { pointerType: 'mouse' });

    expect(flip).toHaveAttribute('aria-pressed', 'false');
  });

  it('should flip back when moving to the next title', async () => {
    await renderViewer(null);

    await fireEvent.click(
      screen.getByRole('button', { name: 'Show details' }),
    );
    await tap('Next story');

    expect(screen.getByRole('button', { name: 'Show details' }))
      .toHaveAttribute('aria-pressed', 'false');
  });

  it('should call out a friend finishing a show', async () => {
    const finished = story(ShowSiloMappedMock);
    const milestone = { type: 'series-end' as const, season: 2 };
    renderComponent(TodayStoryViewer, {
      props: {
        groups: toStoryGroups({
          forYou: [],
          titles: [{
            ...finished,
            milestone,
            actions: finished.actions.map((action) => ({
              ...action,
              milestone,
            })),
          }],
        }),
        startKey: null,
        onClose: vi.fn(),
      },
    });

    expect(await screen.findByText('Finished the show')).toBeInTheDocument();
  });

  it('should show a friend comment with a link to it', async () => {
    const commented = story(MovieHereticMappedMock);
    renderComponent(TodayStoryViewer, {
      props: {
        groups: toStoryGroups({
          forYou: [],
          titles: [{
            ...commented,
            actions: [
              buildFriendAction({
                key: 'comment:9',
                kind: 'comment',
                comment: {
                  id: 9,
                  text: 'That ending though.',
                  gif: null,
                  isSpoiler: false,
                  isReview: false,
                  likeCount: 0,
                  replyCount: 0,
                },
              }),
            ],
          }],
        }),
        startKey: null,
        onClose: vi.fn(),
      },
    });

    expect(await screen.findByText('That ending though.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open the comment' }))
      .toBeInTheDocument();
  });
});

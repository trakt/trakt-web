import type { TodayStoryGroup } from '$lib/sections/today/models/TodayStoryGroup.ts';
import type { TodayTitleStory } from '$lib/sections/today/models/TodayTitleStory.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { fireEvent, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { buildFriendAction } from '$test/beds/today/buildFriendAction.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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
  // The first render in a cold worker can exceed the 1s default on busy CI runners.
  await screen.findByRole('dialog', {}, { timeout: 10_000 });
  return onClose;
}

async function tap(name: 'Next story' | 'Previous story') {
  const user = userEvent.setup();
  const [zone] = screen.getAllByRole('button', { name });
  await user.click(assertDefined(zone));
}

describe('TodayStoryViewer', () => {
  beforeEach(() => {
    setAuthorization(true);
  });

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
    const stage = assertDefined(document.querySelector('[data-zone="next"]'));

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

  it('should flip the poster on a touch tap reported as a mouse click', async () => {
    await renderViewer(null);
    const flip = screen.getByRole('button', { name: 'Show details' });

    await fireEvent.pointerDown(flip, { pointerType: 'touch' });
    await fireEvent.pointerUp(flip, { pointerType: 'touch' });
    await fireEvent(
      flip,
      new PointerEvent('click', {
        bubbles: true,
        detail: 1,
        pointerType: 'mouse',
      }),
    );

    expect(flip).toHaveAttribute('aria-pressed', 'true');
  });

  it('should flip the poster while a mouse is over it', async () => {
    await renderViewer(null);
    const poster = assertDefined(document.querySelector('.poster-hit'));
    poster.getBoundingClientRect = () =>
      ({ left: 100, right: 300, top: 100, bottom: 400 }) as DOMRect;
    const flip = screen.getByRole('button', { name: 'Show details' });

    await fireEvent.pointerMove(window, {
      clientX: 150,
      clientY: 150,
      pointerType: 'mouse',
    });

    expect(flip).toHaveAttribute('aria-pressed', 'true');

    await fireEvent.pointerMove(window, {
      clientX: 700,
      clientY: 150,
      pointerType: 'mouse',
    });

    expect(flip).toHaveAttribute('aria-pressed', 'false');
  });

  it('should have the back ready before the poster is flipped', async () => {
    await renderViewer(null);

    await waitFor(() => {
      expect(document.querySelector('.trakt-today-poster-details'))
        .not.toBeNull();
    });
  });

  it('should keep the back out of reach until it is flipped', async () => {
    await renderViewer(null);
    const back = assertDefined(
      document.querySelector<HTMLElement>('.poster-face.is-back'),
    );

    expect(back.inert).toBe(true);

    await fireEvent.click(
      screen.getByRole('button', { name: 'Show details' }),
    );

    expect(back.inert).toBe(false);
  });

  it('should link to everything from today', async () => {
    await renderViewer(null);

    expect(screen.getByRole('link', { name: 'View everything from today' }))
      .toBeInTheDocument();
  });

  it('should highlight a movie the user also watched', async () => {
    const watched = { ...MovieHereticMappedMock, id: 916302 };
    renderComponent(TodayStoryViewer, {
      props: {
        groups: toStoryGroups({ forYou: [], titles: [story(watched)] }),
        startKey: null,
        onClose: vi.fn(),
      },
    });

    expect(await screen.findByText('Watched'))
      .toBeInTheDocument();
  });

  it('should not highlight a movie the user has not watched', async () => {
    await renderViewer(null);

    expect(document.querySelector('.poster-watched')).not
      .toBeInTheDocument();
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

    expect(await screen.findByRole('img', { name: 'Finished the show' }))
      .toBeInTheDocument();
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

  it('should close on escape while focus is inside', async () => {
    const onClose = await renderViewer(null);

    await fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });

    expect(onClose).toHaveBeenCalled();
  });

  it('should not close on escape pressed somewhere else', async () => {
    const onClose = await renderViewer(null);

    await fireEvent.keyDown(document.body, { key: 'Escape' });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('should take focus when it opens and give it back when it closes', async () => {
    const opener = document.createElement('button');
    document.body.appendChild(opener);
    opener.focus();

    const { unmount } = renderComponent(TodayStoryViewer, {
      props: { groups, startKey: null, onClose: vi.fn() },
    });
    const dialog = await screen.findByRole('dialog');

    expect(document.activeElement).toBe(dialog);

    unmount();

    expect(document.activeElement).toBe(opener);
    opener.remove();
  });

  it('should not leave a tap zone focused after a mouse click', async () => {
    await renderViewer(null);
    const next = screen.getAllByRole('button', { name: 'Next story' })[0];
    const zone = assertDefined(next);

    zone.focus();
    await fireEvent.click(zone, { detail: 1 });

    expect(document.activeElement).toBe(screen.getByRole('dialog'));
  });

  it('should keep focus on a tap zone activated from the keyboard', async () => {
    await renderViewer(null);
    const next = screen.getAllByRole('button', { name: 'Next story' })[0];
    const zone = assertDefined(next);

    zone.focus();
    await fireEvent.click(zone, { detail: 0 });

    await waitFor(() =>
      expect(document.activeElement).toHaveAttribute(
        'aria-label',
        'Next story',
      )
    );
  });
});

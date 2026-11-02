import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { MovieHereticCommentsMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticCommentsMappedMock.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { BehaviorSubject } from 'rxjs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import CommentBody from './CommentBody.svelte';

const { track } = vi.hoisted(() => ({ track: vi.fn() }));
const isWatched = new BehaviorSubject(false);

vi.mock('$lib/features/analytics/useTrack.ts', () => ({
  useTrack: () => ({ track }),
}));

vi.mock('$lib/sections/media-actions/mark-as-watched/useIsWatched.ts', () => ({
  useIsWatched: () => ({ isWatched, isPartiallyWatched: isWatched }),
}));

const [comment] = MovieHereticCommentsMappedMock;

describe('component: CommentBody', () => {
  afterEach(() => {
    track.mockClear();
    isWatched.next(false);
  });

  it('should track one comment reveal for one tap on a spoiler comment', async () => {
    const user = userEvent.setup();
    renderComponent(CommentBody, {
      props: {
        media: MovieHereticMappedMock,
        comment: { ...comment!, isSpoiler: true },
        type: 'movie',
        variant: 'full',
      },
    });

    await user.click(await screen.findByText(comment!.comment));

    expect(track).toHaveBeenCalledTimes(1);
    expect(track).toHaveBeenCalledWith({ type: 'comment' });
  });

  it('should track one comment reveal for one tap on an inline spoiler', async () => {
    const user = userEvent.setup();
    renderComponent(CommentBody, {
      props: {
        media: MovieHereticMappedMock,
        comment: {
          ...comment!,
          comment: 'Before [spoiler]the twist[/spoiler]',
        },
        type: 'movie',
        variant: 'full',
      },
    });

    await user.click(await screen.findByText('the twist'));

    expect(track).toHaveBeenCalledTimes(1);
    expect(track).toHaveBeenCalledWith({ type: 'comment' });
  });

  it('should not track a tap on a comment that is not hidden', async () => {
    const user = userEvent.setup();
    renderComponent(CommentBody, {
      props: {
        media: MovieHereticMappedMock,
        comment: comment!,
        type: 'movie',
        variant: 'full',
      },
    });

    await user.click(await screen.findByText(comment!.comment));

    expect(track).not.toHaveBeenCalled();
  });

  describe('when the media is watched', () => {
    it('should show a spoiler comment without blur', async () => {
      isWatched.next(true);
      renderComponent(CommentBody, {
        props: {
          media: MovieHereticMappedMock,
          comment: { ...comment!, isSpoiler: true },
          type: 'movie',
          variant: 'full',
        },
      });

      const text = await screen.findByText(comment!.comment);

      expect(text.closest('.trakt-spoiler')).toBeNull();
    });

    it('should show an inline spoiler without blur', async () => {
      isWatched.next(true);
      renderComponent(CommentBody, {
        props: {
          media: MovieHereticMappedMock,
          comment: {
            ...comment!,
            comment: 'Before [spoiler]the twist[/spoiler]',
          },
          type: 'movie',
          variant: 'full',
        },
      });

      const text = await screen.findByText('the twist');

      expect(text.closest('.trakt-spoiler')).toBeNull();
    });
  });
});

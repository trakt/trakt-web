import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { MovieHereticCommentsMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticCommentsMappedMock.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import CommentBody from './CommentBody.svelte';

const { track } = vi.hoisted(() => ({ track: vi.fn() }));

vi.mock('$lib/features/analytics/useTrack.ts', () => ({
  useTrack: () => ({ track }),
}));

const [comment] = MovieHereticCommentsMappedMock;

describe('component: CommentBody', () => {
  afterEach(() => {
    track.mockClear();
  });

  it('should track one comment reveal for one tap on a spoiler comment', async () => {
    const user = userEvent.setup();
    renderComponent(CommentBody, {
      props: {
        media: MovieHereticMappedMock,
        comment: { ...comment!, isSpoiler: true },
        type: 'full',
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
        type: 'full',
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
        type: 'full',
      },
    });

    await user.click(await screen.findByText(comment!.comment));

    expect(track).not.toHaveBeenCalled();
  });
});

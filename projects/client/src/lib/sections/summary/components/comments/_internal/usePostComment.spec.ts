import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { EpisodeSiloCommentReplyResponseMock } from '$mocks/data/summary/episodes/silo/response/EpisodeSiloCommentReplyResponseMock.ts';
import { server } from '$mocks/server.ts';
import { captureInvalidations } from '$test/beds/query/captureInvalidations.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { firstValueFrom } from 'rxjs';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import { CommentError } from './models/CommentError.ts';
import { usePostComment } from './usePostComment.ts';

const COMMENT_URL = 'http://localhost/comments';
const [commentResponse] = EpisodeSiloCommentReplyResponseMock;

function serveComment({
  method,
  url,
  status,
}: {
  method: 'post' | 'put';
  url: string;
  status: number;
}) {
  const bodies: unknown[] = [];
  server.use(
    http[method](url, async ({ request }) => {
      bodies.push(await request.json());
      return HttpResponse.json(commentResponse, { status });
    }),
  );

  return bodies;
}

const postProps = {
  commentType: 'post' as const,
  type: 'movie' as const,
  media: MovieHereticMappedMock,
  comment: 'Great movie',
  gif: null,
  isSpoiler: false,
};

describe('store: usePostComment', () => {
  describe('when authorized', () => {
    beforeEach(() => {
      setAuthorization(true);
    });

    it('should post a comment on the media', async () => {
      const bodies = serveComment({
        method: 'post',
        url: COMMENT_URL,
        status: 201,
      });
      const { postComment } = await renderStore(() => usePostComment());

      const result = await postComment(postProps);

      expect(result?.id).to.equal(commentResponse?.id);
      expect(bodies).to.have.length(1);
      expect(bodies[0]).to.deep.include({
        comment: 'Great movie',
        spoiler: false,
        movie: { ids: { trakt: MovieHereticMappedMock.id } },
      });
    });

    it('should reply to the given comment id', async () => {
      const bodies = serveComment({
        method: 'post',
        url: `${COMMENT_URL}/77/replies`,
        status: 201,
      });
      const { postComment } = await renderStore(() => usePostComment());

      const result = await postComment({
        commentType: 'reply',
        id: 77,
        type: 'movie',
        comment: 'Agreed',
        gif: null,
        isSpoiler: true,
      });

      expect(result?.id).to.equal(commentResponse?.id);
      expect(bodies[0]).to.deep.include({ comment: 'Agreed', spoiler: true });
    });

    it('should edit the given comment id', async () => {
      const bodies = serveComment({
        method: 'put',
        url: `${COMMENT_URL}/77`,
        status: 200,
      });
      const { postComment } = await renderStore(() => usePostComment());

      const result = await postComment({
        commentType: 'edit',
        id: 77,
        type: 'movie',
        comment: 'Edited',
        gif: null,
        isSpoiler: false,
      });

      expect(result?.id).to.equal(commentResponse?.id);
      expect(bodies[0]).to.deep.include({ comment: 'Edited' });
    });

    it('should invalidate posted comments after posting', async () => {
      serveComment({ method: 'post', url: COMMENT_URL, status: 201 });
      const { postComment } = await renderStore(() => usePostComment());

      const invalidations = await captureInvalidations(() =>
        postComment(postProps),
      );

      expect(invalidations).toContain(InvalidateAction.Comment.Post('movie'));
    });

    it('should invalidate posts and replies after editing', async () => {
      serveComment({ method: 'put', url: `${COMMENT_URL}/77`, status: 200 });
      const { postComment } = await renderStore(() => usePostComment());

      const invalidations = await captureInvalidations(() =>
        postComment({
          commentType: 'edit',
          id: 77,
          type: 'movie',
          comment: 'Edited',
          gif: null,
          isSpoiler: false,
        }),
      );

      expect(invalidations).toContain(InvalidateAction.Comment.Post('movie'));
      expect(invalidations).toContain(InvalidateAction.Comment.Reply('movie'));
    });

    it('should expose invalid content when the server answers 422', async () => {
      server.use(
        http.post(COMMENT_URL, () => new HttpResponse(null, { status: 422 })),
      );
      const { postComment, error } = await renderStore(() => usePostComment());

      const result = await postComment(postProps);

      expect(result).to.equal(null);
      expect(await firstValueFrom(error)).to.equal(CommentError.InvalidContent);
    });

    it('should expose an unknown error for other http failures', async () => {
      server.use(
        http.post(COMMENT_URL, () => new HttpResponse(null, { status: 403 })),
      );
      const { postComment, error } = await renderStore(() => usePostComment());

      await postComment(postProps);

      expect(await firstValueFrom(error)).to.equal(CommentError.Unknown);
    });

    it('should clear the previous error on the next attempt', async () => {
      server.use(
        http.post(COMMENT_URL, () => new HttpResponse(null, { status: 422 })),
      );
      const { postComment, error } = await renderStore(() => usePostComment());
      await postComment(postProps);

      serveComment({ method: 'post', url: COMMENT_URL, status: 201 });
      await postComment(postProps);

      expect(await firstValueFrom(error)).to.equal(null);
    });
  });
});

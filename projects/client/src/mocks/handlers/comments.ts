import { http, HttpResponse } from 'msw';

import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { EpisodeSiloCommentsMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloCommentsMappedMock.ts';
import { EpisodeSiloCommentReplyResponseMock } from '$mocks/data/summary/episodes/silo/response/EpisodeSiloCommentReplyResponseMock.ts';
import { EpisodeSiloCommentsResponseMock } from '$mocks/data/summary/episodes/silo/response/EpisodeSiloCommentsResponseMock.ts';
import { MovieHereticCommentsResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticCommentsResponseMock.ts';
import { EpisodeSiloCommentReactionsResponseMock } from '../data/summary/episodes/silo/response/EpisodeSiloCommentReactionsResponseMock.ts';

const commentResponseMocks = [
  ...EpisodeSiloCommentsResponseMock,
  ...MovieHereticCommentsResponseMock,
];

export const comments = [
  http.get(
    'http://localhost/comments/:id',
    ({ params }) => {
      const id = Number(params.id);
      const comment = commentResponseMocks.find((comment) => comment.id === id);

      if (comment == null) {
        return HttpResponse.json(null, { status: 404 });
      }

      return HttpResponse.json(comment);
    },
  ),
  http.get(
    `http://localhost/comments/${
      assertDefined(EpisodeSiloCommentsMappedMock.at(0)).id
    }/replies`,
    () => {
      return HttpResponse.json(EpisodeSiloCommentReplyResponseMock);
    },
  ),
  http.get(
    'http://localhost/comments/*/reactions/summary',
    () => {
      return HttpResponse.json(EpisodeSiloCommentReactionsResponseMock);
    },
  ),
];

import { http, HttpResponse } from 'msw';

import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { EpisodeSiloCommentsMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloCommentsMappedMock.ts';
import { EpisodeSiloCommentReplyResponseMock } from '$mocks/data/summary/episodes/silo/response/EpisodeSiloCommentReplyResponseMock.ts';

//http://localhost/comments/420/replies?page=1&limit=10
export const comments = [
  http.get(
    `http://localhost/comments/${
      assertDefined(EpisodeSiloCommentsMappedMock.at(0)).id
    }/replies`,
    () => {
      return HttpResponse.json(EpisodeSiloCommentReplyResponseMock);
    },
  ),
];

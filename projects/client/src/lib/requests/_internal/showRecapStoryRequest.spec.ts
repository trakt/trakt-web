import { ShowRecapStoryResponseMock } from '$mocks/data/summary/season-recap/response/ShowRecapStoryResponseMock.ts';
import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { showRecapStoryRequest } from './showRecapStoryRequest.ts';

const STORY_URL = 'http://localhost/v3/shows/severance/recap/story';

function request() {
  return showRecapStoryRequest({ slug: 'severance', through: 2 });
}

describe('showRecapStoryRequest', () => {
  it('should ask for the story up to the given season', async () => {
    let through: string | null = null;
    server.use(
      http.get(STORY_URL, ({ request }) => {
        through = new URL(request.url).searchParams.get('through');
        return HttpResponse.json(ShowRecapStoryResponseMock);
      }),
    );

    expect(await request()).to.deep.equal({
      body: ShowRecapStoryResponseMock,
      status: 200,
    });
    expect(through).toBe('2');
  });

  it.each([401, 403, 404])('should treat a %i as no story', async (status) => {
    server.use(http.get(STORY_URL, () => new HttpResponse(null, { status })));

    expect(await request()).to.deep.equal({ body: undefined, status: 204 });
  });

  it('should pass a server failure through so the query retries', async () => {
    server.use(
      http.get(STORY_URL, () => new HttpResponse(null, { status: 503 })),
    );

    expect(await request()).to.deep.equal({ body: undefined, status: 503 });
  });
});

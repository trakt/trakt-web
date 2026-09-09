import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { listIdsRequest } from './listIdsRequest.ts';

const PATH = '/v3/movies/heretic-2024/me/lists';
const URL = `http://localhost${PATH}`;

describe('listIdsRequest', () => {
  it('should return the list ids of a successful response', async () => {
    server.use(http.get(URL, () => HttpResponse.json([1, 2])));

    const response = await listIdsRequest({ path: PATH });

    expect(response.body).to.deep.equal([1, 2]);
  });

  it('should return no ids when the request fails', async () => {
    server.use(
      http.get(URL, () => HttpResponse.json([], { status: 500 })),
    );

    const response = await listIdsRequest({ path: PATH });

    expect(response.body).to.deep.equal([]);
  });

  it('should reject a payload that is not a list of ids', async () => {
    server.use(http.get(URL, () => HttpResponse.json({ ids: [1, 2] })));

    await expect(listIdsRequest({ path: PATH })).rejects.toThrow();
  });

  it('should reject ids that are not numeric', async () => {
    server.use(http.get(URL, () => HttpResponse.json(['1', '2'])));

    await expect(listIdsRequest({ path: PATH })).rejects.toThrow();
  });
});

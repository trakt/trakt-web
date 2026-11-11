import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { addToListRequest } from './addToListRequest.ts';

const URL = 'http://localhost/users/me/lists/7/items';
const params = { listId: 7, body: { movies: [{ ids: { trakt: 1 } }] } };

function refuse(error: unknown, headers: Record<string, string> = {}) {
  server.use(
    http.post(URL, () =>
      HttpResponse.json({ error }, { status: 420, headers }),
    ),
  );
}

describe('addToListRequest', () => {
  it('should report added on a 201', async () => {
    server.use(http.post(URL, () => HttpResponse.json({}, { status: 201 })));

    expect(await addToListRequest(params)).toEqual({ status: 'added' });
  });

  it('should report list-full on a per-list limit', async () => {
    refuse('list_item_limit_reached', {
      'X-Account-Limit': '100',
      'X-VIP-User': 'false',
    });

    expect(await addToListRequest(params)).toEqual({
      status: 'list-full',
      limit: 100,
      isVip: false,
    });
  });

  it('should report lists-full for a free user on the account limit', async () => {
    refuse('total_list_item_limit_reached', {
      'X-Account-Limit': '500',
      'X-VIP-User': 'false',
    });

    expect(await addToListRequest(params)).toEqual({
      status: 'lists-full',
      limit: 500,
      isVip: false,
    });
  });

  it('should report lists-full for a VIP user on the account limit', async () => {
    refuse('total_list_item_limit_reached', {
      'X-Account-Limit': '5000',
      'X-VIP-User': 'true',
    });

    expect(await addToListRequest(params)).toEqual({
      status: 'lists-full',
      limit: 5000,
      isVip: true,
    });
  });

  it('should fail on a 420 with another error code', async () => {
    refuse('something_else', { 'X-Account-Limit': '100' });

    expect(await addToListRequest(params)).toEqual({ status: 'failed' });
  });

  it('should fail on a 420 without a usable limit header', async () => {
    refuse('list_item_limit_reached');

    expect(await addToListRequest(params)).toEqual({ status: 'failed' });
  });

  it('should fail on a 420 with a non-JSON body', async () => {
    server.use(
      http.post(
        URL,
        () =>
          new HttpResponse('nope', {
            status: 420,
            headers: { 'X-Account-Limit': '100' },
          }),
      ),
    );

    expect(await addToListRequest(params)).toEqual({ status: 'failed' });
  });

  it('should fail on a 500', async () => {
    server.use(http.post(URL, () => new HttpResponse(null, { status: 500 })));

    expect(await addToListRequest(params)).toEqual({ status: 'failed' });
  });
});

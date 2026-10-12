import { ClientStateResponseMock } from '$mocks/data/users/response/ClientStateResponseMock.ts';
import { server } from '$mocks/server.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { delay, http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { currentUserClientStateQuery } from './currentUserClientStateQuery.ts';

describe('currentUserClientStateQuery', () => {
  it('should return the stored client state by key', async () => {
    const result = await runQuery({
      factory: () => createTestBedQuery(currentUserClientStateQuery()),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(ClientStateResponseMock);
  });

  it('should return null when the client state cannot be read', async () => {
    server.use(
      http.get(
        'http://localhost/v3/users/me/client-state',
        () => new HttpResponse(null, { status: 401 }),
      ),
    );

    const result = await runQuery({
      factory: () => createTestBedQuery(currentUserClientStateQuery()),
      waitFor: (response) => response?.isFetched ?? false,
    });

    expect(result?.data).to.equal(null);
  });

  it('should return null when the request fails', async () => {
    server.use(
      http.get(
        'http://localhost/v3/users/me/client-state',
        () => HttpResponse.error(),
      ),
    );

    const result = await runQuery({
      factory: () => createTestBedQuery(currentUserClientStateQuery()),
      waitFor: (response) => response?.isFetched ?? false,
    });

    expect(result?.data).to.equal(null);
  });

  it('should return null when the body is not client state', async () => {
    server.use(
      http.get(
        'http://localhost/v3/users/me/client-state',
        () => HttpResponse.text('<html></html>'),
      ),
    );

    const result = await runQuery({
      factory: () => createTestBedQuery(currentUserClientStateQuery()),
      waitFor: (response) => response?.isFetched ?? false,
    });

    expect(result?.data).to.equal(null);
  });

  it(
    'should give up and return null when the server does not answer',
    async () => {
      server.use(
        http.get('http://localhost/v3/users/me/client-state', async () => {
          await delay('infinite');
          return HttpResponse.json({});
        }),
      );

      const result = await runQuery({
        factory: () => createTestBedQuery(currentUserClientStateQuery()),
        waitFor: (response) => response?.isFetched ?? false,
      });

      expect(result?.data).to.equal(null);
    },
    10_000,
  );
});

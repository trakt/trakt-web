import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { klipyRequest } from './klipyRequest.ts';

const schema = z.object({ data: z.string() });

function respondWith(response: Response): typeof fetch {
  return () => Promise.resolve(response);
}

describe('klipyRequest', () => {
  it('should return the parsed body when klipy answers', async () => {
    const result = await klipyRequest({
      path: 'gifs/trending',
      params: new URLSearchParams(),
      schema,
      fetch: respondWith(Response.json({ data: 'ok' })),
    });

    expect(result.body).to.deep.equal({ data: 'ok' });
  });

  /*
    An outage answered with an empty page would be cached as a successful
    result for the query's whole ttl, blanking the picker long after klipy
    recovered.
  */
  it(
    'should throw when klipy fails rather than answer an empty page',
    async () => {
      await expect(klipyRequest({
        path: 'gifs/trending',
        params: new URLSearchParams(),
        schema,
        fetch: respondWith(new Response(null, { status: 503 })),
      })).rejects.toThrow('Klipy request failed');
    },
  );

  it('should answer an empty body when the payload cannot be read', async () => {
    const result = await klipyRequest({
      path: 'gifs/trending',
      params: new URLSearchParams(),
      schema,
      fetch: respondWith(Response.json({ unexpected: true })),
    });

    expect(result.body).to.equal(undefined);
  });
});

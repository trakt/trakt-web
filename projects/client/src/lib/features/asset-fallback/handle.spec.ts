import type { Handle } from '@sveltejs/kit';
import { describe, expect, it, vi } from 'vitest';
import { handle } from './handle.ts';

type HandleArg = Parameters<Handle>[0];
type R2Object = {
  arrayBuffer: () => Promise<ArrayBuffer>;
  httpEtag: string;
  httpMetadata?: Record<string, string>;
};
type Bucket = { get: (key: string) => Promise<R2Object | null> };

function makeR2Object(
  body: string,
  httpMetadata: Record<string, string> = {},
): R2Object {
  return {
    arrayBuffer: () =>
      Promise.resolve(new TextEncoder().encode(body).buffer as ArrayBuffer),
    httpEtag: '"abc"',
    httpMetadata,
  };
}

function makeArg(
  pathname: string,
  bucket?: Bucket,
  resolve: HandleArg['resolve'] = vi.fn().mockResolvedValue(new Response('ok')),
): HandleArg {
  return {
    event: {
      url: new URL(`https://app.trakt.tv${pathname}`),
      platform: bucket ? { env: { R2_IMMUTABLE: bucket } } : { env: {} },
    } as unknown as HandleArg['event'],
    resolve,
  };
}

describe('handle: asset-fallback', () => {
  it('passes through non-immutable paths', async () => {
    const resolve = vi.fn().mockResolvedValue(new Response('ok'));
    await handle(makeArg('/users/me', undefined, resolve));
    expect(resolve).toHaveBeenCalledOnce();
  });

  it('passes through when bucket is unavailable', async () => {
    const resolve = vi.fn().mockResolvedValue(new Response('ok'));
    await handle(makeArg('/_app/immutable/chunks/foo.js', undefined, resolve));
    expect(resolve).toHaveBeenCalledOnce();
  });

  it('passes through when R2 has no object', async () => {
    const get = vi.fn().mockResolvedValue(null);
    const resolve = vi.fn().mockResolvedValue(new Response('ok'));

    await handle(
      makeArg('/_app/immutable/chunks/missing.js', { get }, resolve),
    );

    expect(get).toHaveBeenCalledWith('_app/immutable/chunks/missing.js');
    expect(resolve).toHaveBeenCalledOnce();
  });

  it('serves the R2 object when present', async () => {
    const object = makeR2Object('console.log(1)');
    const get = vi.fn().mockResolvedValue(object);
    const resolve = vi.fn();

    const response = await handle(
      makeArg('/_app/immutable/chunks/hit.js', { get }, resolve),
    );

    expect(resolve).not.toHaveBeenCalled();
    expect(response.headers.get('cache-control')).toBe(
      'public, immutable, max-age=31536000',
    );
    expect(response.headers.get('content-type')).toBe(
      'text/javascript; charset=utf-8',
    );
    expect(response.headers.get('etag')).toBe('"abc"');
    await expect(response.text()).resolves.toBe('console.log(1)');
  });

  it('infers content-type from extension for css', async () => {
    const object = makeR2Object('body{}');
    const get = vi.fn().mockResolvedValue(object);

    const response = await handle(
      makeArg('/_app/immutable/assets/x.css', { get }),
    );

    expect(response.headers.get('content-type')).toBe(
      'text/css; charset=utf-8',
    );
  });
});

import { mockRequestEvent } from '$test/request/mockRequestEvent.ts';
import type { ResolveOptions } from '@sveltejs/kit';
import { describe, expect, it } from 'vitest';
import { handle, OPEN_SEARCH_LINK_PLACEHOLDER } from './handle.ts';

function transformFor(token: string | null) {
  const event = mockRequestEvent({ url: 'http://localhost' });
  event.locals.oidcAuth = { token, expiresAt: null };

  return new Promise<ResolveOptions>((resolve) => {
    handle({
      event,
      resolve: (_, opts?: ResolveOptions) => {
        resolve(opts ?? {});
        return Promise.resolve(new Response());
      },
    });
  }).then(({ transformPageChunk }) =>
    transformPageChunk?.({
      html: `<head>${OPEN_SEARCH_LINK_PLACEHOLDER}</head>`,
      done: true,
    }),
  );
}

describe('handle: search', () => {
  it('should advertise opensearch to signed in users', async () => {
    expect(await transformFor('token')).to.include(
      '<link rel="search" type="application/opensearchdescription+xml"',
    );
  });

  it('should not advertise opensearch to signed out visitors', async () => {
    expect(await transformFor(null)).toBe('<head></head>');
  });
});

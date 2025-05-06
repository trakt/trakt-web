import { mockRequestEvent } from '$test/request/mockRequestEvent.ts';
import type { Handle, ResolveOptions } from '@sveltejs/kit';

export function interceptHandleResolveOptions(
  handle: Handle,
  request?: Request,
  cookieHandler?: (key: string) => string | Nil,
) {
  return new Promise<ResolveOptions>((resolve) => {
    handle({
      event: mockRequestEvent({
        url: 'http://localhost',
        request,
        cookieHandler,
      }),
      resolve: (_, opts?: ResolveOptions) => {
        resolve(opts ?? {});
        return Promise.resolve(new Response());
      },
    });
  });
}

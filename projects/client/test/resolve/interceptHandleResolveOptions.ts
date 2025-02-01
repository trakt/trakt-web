import { mockRequestEvent } from '$test/request/mockRequestEvent.ts';
import type { Handle, ResolveOptions } from '@sveltejs/kit';

export function interceptHandleResolveOptions(
  handle: Handle,
  request?: Request,
) {
  return new Promise<ResolveOptions>((resolve) => {
    handle({
      event: mockRequestEvent({
        url: 'http://localhost',
        request,
      }),
      resolve: (_, opts?: ResolveOptions) => {
        resolve(opts ?? {});
        return Promise.resolve(new Response());
      },
    });
  });
}

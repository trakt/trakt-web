import { mockRequestEvent } from '$test/request/mockRequestEvent.ts';
import type { Handle, ResolveOptions } from '@sveltejs/kit';

export function interceptHandleResolveOptions(handle: Handle) {
  return new Promise<ResolveOptions>((resolve) => {
    handle({
      event: mockRequestEvent({ url: 'http://localhost' }),
      resolve: (_, opts: ResolveOptions) => {
        resolve(opts);
        return Promise.resolve(new Response());
      },
    });
  });
}

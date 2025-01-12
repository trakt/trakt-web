import type { Handle, ResolveOptions } from '@sveltejs/kit';
import { describe, expect, it } from 'vitest';
import { handle, TIMESTAMP_PLACEHOLDER } from './handle';

function interceptHandleResolveOptions(handle: Handle) {
  return new Promise<ResolveOptions>((resolve) => {
    handle({
      event: {} as any,
      resolve: (_, opts: ResolveOptions) => {
        resolve(opts);
        return Promise.resolve(new Response());
      },
    });
  });
}

describe('handle: cache-bust', () => {
  it('should replace timestamp placeholder with current timestamp', async () => {
    const html = `<html>${TIMESTAMP_PLACEHOLDER}</html>`;

    const { transformPageChunk } = await interceptHandleResolveOptions(
      handle,
    );

    const transformed = transformPageChunk?.({ html, done: true });

    expect(transformed).toMatch(/^<html>\d+<\/html>$/);
    expect(transformed).not.toContain(TIMESTAMP_PLACEHOLDER);
  });

  it('should return unchanged html when not done', async () => {
    const html = `<html>${TIMESTAMP_PLACEHOLDER}</html>`;

    const { transformPageChunk } = await interceptHandleResolveOptions(
      handle,
    );

    const transformed = transformPageChunk?.({ html, done: false });

    expect(transformed).toBe(html);
  });
});

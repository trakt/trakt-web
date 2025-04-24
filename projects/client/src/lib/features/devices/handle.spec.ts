import { interceptHandleResolveOptions } from '$test/resolve/interceptHandleResolveOptions.ts';
import { describe, expect, it } from 'vitest';
import { handle, INITIAL_SCALE_PLACEHOLDER } from './handle.ts';

describe('handle: devices', () => {
  it('should replace initial scale placeholder with the default scaling', async () => {
    const html = `<html>${INITIAL_SCALE_PLACEHOLDER}</html>`;

    const { transformPageChunk } = await interceptHandleResolveOptions(
      handle,
    );

    const transformed = transformPageChunk?.({ html, done: true });

    expect(transformed).toMatch('<html>1</html>');
  });

  it('should replace initial scale placeholder on a tv', async () => {
    const html = `<html>${INITIAL_SCALE_PLACEHOLDER}</html>`;

    const { transformPageChunk } = await interceptHandleResolveOptions(
      handle,
      new Request('http://localhost', {
        headers: new Headers({ 'user-agent': 'android tv' }),
      }),
    );

    const transformed = transformPageChunk?.({ html, done: true });

    expect(transformed).toMatch('<html>0.75</html>');
  });
});

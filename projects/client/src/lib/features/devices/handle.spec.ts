import { interceptHandleResolveOptions } from '$test/resolve/interceptHandleResolveOptions.ts';
import { describe, expect, it } from 'vitest';
import { DEVICE_SCALE_PLACEHOLDER, handle } from './handle.ts';

describe('handle: devices', () => {
  it('should replace initial scale placeholder with the default scaling', async () => {
    const html = `<html>${DEVICE_SCALE_PLACEHOLDER}</html>`;

    const { transformPageChunk } = await interceptHandleResolveOptions(
      handle,
    );

    const transformed = transformPageChunk?.({ html, done: true });

    expect(transformed).toMatch('<html>1</html>');
  });
});

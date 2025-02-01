import { interceptHandleResolveOptions } from '$test/resolve/interceptHandleResolveOptions.ts';
import { describe, expect, it } from 'vitest';
import { handle, OS_PLACEHOLDER } from './handle.ts';

describe('handle: mobile-os', () => {
  function requestWithAgent(agent: string) {
    return new Request('http://localhost', {
      headers: new Headers({ 'user-agent': agent }),
    });
  }

  it('should set android as the mobile OS', async () => {
    const html = `<html>${OS_PLACEHOLDER}</html>`;

    const { transformPageChunk } = await interceptHandleResolveOptions(
      handle,
      requestWithAgent('Android'),
    );
    const transformed = transformPageChunk?.({ html, done: true });

    expect(transformed).toEqual('<html>android</html>');
  });

  it('should set ios as the mobile OS for iPads', async () => {
    const html = `<html>${OS_PLACEHOLDER}</html>`;

    const { transformPageChunk } = await interceptHandleResolveOptions(
      handle,
      requestWithAgent('iPad'),
    );
    const transformed = transformPageChunk?.({ html, done: true });

    expect(transformed).toEqual('<html>ios</html>');
  });

  it('should set ios as the mobile OS for iPhones', async () => {
    const html = `<html>${OS_PLACEHOLDER}</html>`;

    const { transformPageChunk } = await interceptHandleResolveOptions(
      handle,
      requestWithAgent('iPhone'),
    );
    const transformed = transformPageChunk?.({ html, done: true });

    expect(transformed).toEqual('<html>ios</html>');
  });

  it('should set ios as the mobile OS for iPods', async () => {
    const html = `<html>${OS_PLACEHOLDER}</html>`;

    const { transformPageChunk } = await interceptHandleResolveOptions(
      handle,
      requestWithAgent('iPod'),
    );
    const transformed = transformPageChunk?.({ html, done: true });

    expect(transformed).toEqual('<html>ios</html>');
  });

  it('should set unkown otherwise', async () => {
    const html = `<html>${OS_PLACEHOLDER}</html>`;

    const { transformPageChunk } = await interceptHandleResolveOptions(
      handle,
      requestWithAgent('seferOS'),
    );
    const transformed = transformPageChunk?.({ html, done: true });

    expect(transformed).toEqual('<html>unknown</html>');
  });
});

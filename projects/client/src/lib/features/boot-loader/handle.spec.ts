import { interceptHandleResolveOptions } from '$test/resolve/interceptHandleResolveOptions.ts';
import { describe, expect, it } from 'vitest';
import { BOOT_LOADER_PLACEHOLDER, handle } from './handle.ts';

const STYLESHEET =
  '<link href="/_app/immutable/assets/a.css" rel="stylesheet">';

const page = (head: string) =>
  `<html><head>${head}</head><body>${BOOT_LOADER_PLACEHOLDER}<div></div></body></html>`;

describe('handle: boot-loader', () => {
  it('should move stylesheets from the head to after the loader', async () => {
    const { transformPageChunk } = await interceptHandleResolveOptions(handle);

    const transformed = await transformPageChunk?.({
      html: page(STYLESHEET),
      done: true,
    }) ?? '';
    const [head = '', body = ''] = transformed.split('</head>');
    const bootStylesheet =
      '<link href="/_app/immutable/assets/a.css" rel="stylesheet" data-boot-css';

    expect(head).not.toContain(STYLESHEET);
    expect(body.indexOf('boot-loader-bar')).toBeLessThan(
      body.indexOf(bootStylesheet),
    );
    expect(body.indexOf(bootStylesheet)).toBeLessThan(
      body.indexOf('<div></div>'),
    );
  });

  it('should inject the loader with the stylesheet and script totals', async () => {
    const { preload, transformPageChunk } = await interceptHandleResolveOptions(
      handle,
    );

    preload?.({ type: 'js', path: '/_app/immutable/entry/start.js' });
    preload?.({ type: 'js', path: '/_app/immutable/entry/app.js' });

    const transformed = await transformPageChunk?.({
      html: page(STYLESHEET + STYLESHEET),
      done: true,
    });

    expect(transformed).not.toContain(BOOT_LOADER_PLACEHOLDER);
    expect(transformed).toContain('data-css="2"');
    expect(transformed).toContain('data-js="2"');
  });

  it('should keep the default preload behavior', async () => {
    const { preload } = await interceptHandleResolveOptions(handle);

    expect(preload?.({ type: 'css', path: 'a.css' })).toBe(true);
    expect(preload?.({ type: 'js', path: 'a.js' })).toBe(true);
    expect(preload?.({ type: 'font', path: 'a.woff2' })).toBe(false);
  });

  it('should drop the placeholder when the page has no stylesheets', async () => {
    const { transformPageChunk } = await interceptHandleResolveOptions(handle);

    const transformed = await transformPageChunk?.({
      html: page(''),
      done: true,
    });

    expect(transformed).toBe(page('').replace(BOOT_LOADER_PLACEHOLDER, ''));
  });

  it('should leave stylesheets blocking for crawlers', async () => {
    const request = new Request('http://localhost', {
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' },
    });
    const { preload, transformPageChunk } = await interceptHandleResolveOptions(
      handle,
      request,
    );

    const transformed = await transformPageChunk?.({
      html: page(STYLESHEET),
      done: true,
    });

    expect(preload).toBeUndefined();
    expect(transformed).toBe(
      page(STYLESHEET).replace(BOOT_LOADER_PLACEHOLDER, ''),
    );
  });
});

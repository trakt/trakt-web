import { mockRequestEvent } from '$test/request/mockRequestEvent.ts';
import { interceptHandleResolveOptions } from '$test/resolve/interceptHandleResolveOptions.ts';
import { describe, expect, it, vi } from 'vitest';
import { LOCALE_COOKIE_NAME } from './constants.ts';
import { DIR_PLACEHOLDER, handle, LANG_PLACEHOLDER } from './handle.ts';
import { getLocale } from './index.ts';

describe('handle: i18n', () => {
  it('should replace lang and text direction placeholders', async () => {
    const html = `<html
                  lang="${LANG_PLACEHOLDER}"
                  dir="${DIR_PLACEHOLDER}">
                ></html>`;

    const { transformPageChunk } = await interceptHandleResolveOptions(
      handle,
      new Request('http://localhost', {
        headers: new Headers({
          'Accept-Language': 'en-us',
        }),
      }),
    );

    const transformed = transformPageChunk?.({ html, done: true });

    expect(transformed).toContain('lang="en"');
    expect(transformed).toContain('dir="ltr"');
  });

  it('should set locale cookie', async () => {
    const event = mockRequestEvent({
      url: 'http://localhost/_features/locale/set',
      request: new Request('http://localhost/_features/locale/set', {
        method: 'POST',
        body: JSON.stringify({ locale: 'en' }),
      }),
    });

    const response = await handle({ event, resolve: vi.fn() });

    expect(response).toBeInstanceOf(Response);
    expect(response.headers.get('Set-Cookie')).toEqual(
      'trakt-locale=en;httpOnly=true;secure=true;maxAge=157680000;path=/',
    );
  });

  it('should use the accept-language by default', async () => {
    const html = `<html
                  lang="${LANG_PLACEHOLDER}"
                  dir="${DIR_PLACEHOLDER}">
                ></html>`;

    const { transformPageChunk } = await interceptHandleResolveOptions(
      handle,
      new Request('http://localhost', {
        headers: new Headers({
          'Accept-Language': 'nl-nl',
        }),
      }),
    );

    const transformed = transformPageChunk?.({ html, done: true });

    expect(transformed).toContain('lang="nl-NL"');
  });

  it('should prefer the cookie over the accept-language header', async () => {
    const cookieLocale = 'en';

    const html = `<html
                  lang="${LANG_PLACEHOLDER}"
                  dir="${DIR_PLACEHOLDER}">
                ></html>`;

    const { transformPageChunk } = await interceptHandleResolveOptions(
      handle,
      new Request('http://localhost', {
        headers: new Headers({
          'Accept-Language': 'nl-nl',
        }),
      }),
      (key) => {
        if (key === LOCALE_COOKIE_NAME) {
          return cookieLocale;
        }
        return null;
      },
    );

    const transformed = transformPageChunk?.({ html, done: true });

    expect(transformed).toContain(`lang="${cookieLocale}"`);
  });

  it('should not leak locale across concurrent requests', async () => {
    let release: (() => void) | undefined;
    const gate = new Promise<void>((resolve) => (release = resolve));
    const observed: Array<string> = [];

    // German request pauses mid-render to let an English request complete
    // and mutate paraglide's shared global locale.
    const germanRequest = handle({
      event: mockRequestEvent({
        url: 'http://localhost',
        request: new Request('http://localhost', {
          headers: new Headers({ 'Accept-Language': 'de-de' }),
        }),
      }),
      resolve: async () => {
        observed.push(getLocale());
        await gate;
        observed.push(getLocale());
        return new Response('');
      },
    });

    await handle({
      event: mockRequestEvent({
        url: 'http://localhost',
        request: new Request('http://localhost', {
          headers: new Headers({ 'Accept-Language': 'en-us' }),
        }),
      }),
      resolve: () => Promise.resolve(new Response('')),
    });

    release?.();
    await germanRequest;

    // Both reads stay German despite the interleaved English request.
    expect(observed).toEqual(['de-DE', 'de-DE']);
  });
});

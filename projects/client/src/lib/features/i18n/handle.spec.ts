import { mockRequestEvent } from '$test/request/mockRequestEvent.ts';
import { interceptHandleResolveOptions } from '$test/resolve/interceptHandleResolveOptions.ts';
import { describe, expect, it, vi } from 'vitest';
import { DIR_PLACEHOLDER, handle, LANG_PLACEHOLDER } from './handle.ts';

describe('handle: i18n', () => {
  it('should replace lang and text direction placeholders', async () => {
    const html = `<html
                  lang="${LANG_PLACEHOLDER}"
                  dir="${DIR_PLACEHOLDER}">
                ></html>`;

    const { transformPageChunk } = await interceptHandleResolveOptions(handle);

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
});

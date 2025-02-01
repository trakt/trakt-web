import { mockRequestEvent } from '$test/request/mockRequestEvent';
import { interceptHandleResolveOptions } from '$test/resolve/interceptHandleResolveOptions';
import { describe, expect, it, vi } from 'vitest';
import { handle, THEME_PLACEHOLDER } from './handle';
import { ThemeEndpoint } from './ThemeEndpoint';
import { coerceTheme } from './utils/coerceTheme';

describe('handle: theme', () => {
  it('should replace theme palceholder with the default theme', async () => {
    const html = `<html>${THEME_PLACEHOLDER}</html>`;

    const { transformPageChunk } = await interceptHandleResolveOptions(
      handle,
    );

    const transformed = transformPageChunk?.({ html, done: true });

    expect(transformed).toMatch(`<html>${coerceTheme(undefined)}</html>`);
  });

  it('should set the theme cookie', async () => {
    const event = mockRequestEvent({
      url: `http://localhost${ThemeEndpoint.Set}`,
      request: new Request(`http://localhost${ThemeEndpoint.Set}`, {
        method: 'POST',
        body: JSON.stringify({ theme: 'light' }),
      }),
    });

    const response = await handle({ event, resolve: vi.fn() });

    expect(response).toBeInstanceOf(Response);
    expect(response.headers.get('Set-Cookie')).toEqual(
      'trakt-theme=light;path=/;maxAge=157680000',
    );
  });
});

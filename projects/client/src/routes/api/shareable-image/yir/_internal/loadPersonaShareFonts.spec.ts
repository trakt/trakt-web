import { beforeEach, describe, expect, it, vi } from 'vitest';

const FONT = new Uint8Array([1, 2, 3]).buffer;
const CSS =
  '@font-face { src: url(https://fonts.gstatic.com/s/x/v1/font.ttf) }';

async function load({
  stored,
  fetch,
}: {
  stored: ReadonlySet<string>;
  fetch: typeof globalThis.fetch;
}) {
  const { loadPersonaShareFonts } = await import('./loadPersonaShareFonts.ts');
  const put = vi.fn().mockResolvedValue(undefined);
  const bucket = {
    get: vi.fn((key: string) =>
      Promise.resolve(
        stored.has(key) ? { arrayBuffer: () => Promise.resolve(FONT) } : null,
      ),
    ),
    put,
  };

  const result = await loadPersonaShareFonts({
    persona: 'opening-act',
    bucket: bucket as never,
    fetch,
  });

  return { result, put };
}

const googleFetch = vi.fn((url: string | URL | Request) =>
  Promise.resolve(
    String(url).includes('googleapis') ? new Response(CSS) : new Response(FONT),
  ),
);

describe('util: loadPersonaShareFonts', () => {
  beforeEach(() => {
    vi.resetModules();
    googleFetch.mockClear();
  });

  it('should read the persona fonts from R2', async () => {
    const stored = new Set([
      'assets/fonts/yir/jetbrains-mono-400.ttf',
      'assets/fonts/yir/jetbrains-mono-600.ttf',
      'assets/fonts/yir/spline-sans-400.ttf',
      'assets/fonts/yir/spline-sans-600.ttf',
      'assets/fonts/yir/spline-sans-700.ttf',
      'assets/fonts/yir/caveat-700.ttf',
    ]);

    const { result, put } = await load({ stored, fetch: googleFetch });

    expect(result.isComplete).toBe(true);
    expect(result.fonts.map(({ name, weight }) => `${name} ${weight}`)).toEqual(
      [
        'JetBrains Mono 400',
        'JetBrains Mono 600',
        'Spline Sans 400',
        'Spline Sans 600',
        'Spline Sans 700',
        'Caveat 700',
      ],
    );
    expect(googleFetch).not.toHaveBeenCalled();
    expect(put).not.toHaveBeenCalled();
  });

  it('should fetch a missing font from Google Fonts and store it in R2', async () => {
    const { result, put } = await load({
      stored: new Set(),
      fetch: googleFetch,
    });

    expect(result.isComplete).toBe(true);
    expect(googleFetch).toHaveBeenCalledWith(
      'https://fonts.googleapis.com/css2?family=Caveat:ital,wght@0,700',
      expect.anything(),
    );
    expect(put).toHaveBeenCalledWith(
      'assets/fonts/yir/caveat-700.ttf',
      FONT,
      expect.anything(),
    );
  });

  it('should flag the fonts as incomplete when one cannot be loaded', async () => {
    const failingFetch = vi.fn((url: string | URL | Request) =>
      Promise.resolve(
        String(url).includes('Caveat')
          ? new Response('', { status: 400 })
          : googleFetch(url),
      ),
    );

    const { result } = await load({ stored: new Set(), fetch: failingFetch });

    expect(result.isComplete).toBe(false);
    expect(result.fonts).toHaveLength(5);
  });
});

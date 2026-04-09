import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { isLegitimateBot } from './isLegitimateBot.ts';

const GOOGLEBOT_UA =
  'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.7680.177 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
const BINGBOT_UA =
  'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)';
const DUCKDUCKBOT_UA = 'DuckDuckBot/1.1';
const REGULAR_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function makeFetchMock(
  ptrHostname: string | null,
  aAddress: string | null,
): typeof fetch {
  return vi.fn().mockImplementation((url: string) => {
    const urlStr = String(url);
    if (urlStr.includes('type=PTR')) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            Answer: ptrHostname
              ? [{ data: `${ptrHostname}.` }]
              : undefined,
          }),
      });
    }
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          Answer: aAddress ? [{ data: aAddress }] : undefined,
        }),
    });
  }) as unknown as typeof fetch;
}

describe('isLegitimateBot', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return false for a non-bot user agent', async () => {
    vi.stubGlobal('fetch', makeFetchMock(null, null));
    expect(await isLegitimateBot(REGULAR_UA, '1.2.3.4')).toBe(false);
  });

  it('should return true for a verified Googlebot IP', async () => {
    const ip = '66.249.77.140';
    const hostname = 'crawl-66-249-77-140.googlebot.com';
    vi.stubGlobal('fetch', makeFetchMock(hostname, ip));
    expect(await isLegitimateBot(GOOGLEBOT_UA, ip)).toBe(true);
  });

  it('should return false when PTR hostname does not match bot pattern', async () => {
    const ip = '1.2.3.4';
    vi.stubGlobal('fetch', makeFetchMock('some.evil.host.com', ip));
    expect(await isLegitimateBot(GOOGLEBOT_UA, ip)).toBe(false);
  });

  it('should return false when forward lookup resolves to a different IP', async () => {
    const ip = '66.249.77.140';
    const hostname = 'crawl-66-249-77-140.googlebot.com';
    vi.stubGlobal('fetch', makeFetchMock(hostname, '9.9.9.9'));
    expect(await isLegitimateBot(GOOGLEBOT_UA, ip)).toBe(false);
  });

  it('should return false when PTR lookup returns no record', async () => {
    vi.stubGlobal('fetch', makeFetchMock(null, null));
    expect(await isLegitimateBot(GOOGLEBOT_UA, '66.249.77.140')).toBe(false);
  });

  it('should return false when A record lookup returns no address', async () => {
    const ip = '66.249.77.140';
    const hostname = 'crawl-66-249-77-140.googlebot.com';
    vi.stubGlobal('fetch', makeFetchMock(hostname, null));
    expect(await isLegitimateBot(GOOGLEBOT_UA, ip)).toBe(false);
  });

  it('should return true for a verified Bingbot IP', async () => {
    const ip = '40.77.167.0';
    const hostname = 'msnbot-40-77-167-0.search.msn.com';
    vi.stubGlobal('fetch', makeFetchMock(hostname, ip));
    expect(await isLegitimateBot(BINGBOT_UA, ip)).toBe(true);
  });

  it('should return true for a verified DuckDuckBot IP', async () => {
    const ip = '72.94.249.34';
    const hostname = 'crawl-72-94-249-34.duckduckgo.com';
    vi.stubGlobal('fetch', makeFetchMock(hostname, ip));
    expect(await isLegitimateBot(DUCKDUCKBOT_UA, ip)).toBe(true);
  });

  it('should use the correct PTR form of the IP in the DoH request', async () => {
    const ip = '66.249.77.140';
    const hostname = 'crawl-66-249-77-140.googlebot.com';
    const mockFetch = makeFetchMock(hostname, ip);
    vi.stubGlobal('fetch', mockFetch);

    await isLegitimateBot(GOOGLEBOT_UA, ip);

    const firstCall = vi.mocked(mockFetch).mock.calls[0];
    expect(firstCall[0]).toContain('140.77.249.66.in-addr.arpa');
    expect(firstCall[0]).toContain('type=PTR');
  });

  it('should return false when fetch throws', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('Network error')),
    );
    expect(await isLegitimateBot(GOOGLEBOT_UA, '66.249.77.140')).toBe(false);
  });

  it('should return false when the DoH endpoint returns a non-OK response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 503 }),
    );
    expect(await isLegitimateBot(GOOGLEBOT_UA, '66.249.77.140')).toBe(false);
  });
});
